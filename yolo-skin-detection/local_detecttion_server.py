import os
import json
import requests
import subprocess
import shutil
import cv2
import numpy as np
import yaml
from flask import Flask, request, jsonify
import time
import uuid

app = Flask(__name__)
current_directory = os.getcwd()
IMAGES_FOLDER = 'images'
ANNOTATED_FOLDER = 'annotated'
YOLOV5_FOLDER = 'yolo5v'
DETECT_SCRIPT = os.path.join(YOLOV5_FOLDER, 'detect.py')
WEIGHTS_PATH = './best.pt'
DATA_YAML_PATH = './data.yaml'
API_SIGNED_URL = 'http://localhost:8000/get-signed-url-to-put-object'

os.makedirs(IMAGES_FOLDER, exist_ok=True)
os.makedirs(ANNOTATED_FOLDER, exist_ok=True)

# Load data from YAML file
with open(DATA_YAML_PATH, 'r') as file:
    data_yaml = yaml.safe_load(file)

# Extract names and create letter_to_attribute mapping
names = data_yaml['names']
letter_to_attribute = {
    'F': 'FINELINES',
    'DS': 'Dark Spots',
    'A': 'Acne',
    'C': 'COMEDONE',
    'W': 'Wrinkle',
    'OP': 'Open Pores',
    'R': 'Rashes',
    'DL': 'dark lips',
    'EB': 'eye bag',
    'DC': 'dark circle',
    'ST': 'skin_tags',
    'P': 'pigmentation',
    'SB': 'skin bag',
    'SP': 'spot',
    'UT': 'uneven tone',
    'M': 'mole',
    'PA': 'patches',
    'ML': 'melasma'
}

def stitch_images(image_paths):
    images = [cv2.imread(image_path) for image_path in image_paths]
    height, width, _ = images[0].shape
    resized_images = [cv2.resize(img, (width, height)) for img in images]
    stitched_image = cv2.hconcat(resized_images)
    return stitched_image

def clear_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

def annotate_image(image_path, detections):
    img = cv2.imread(image_path)
    h, w = img.shape[:2]
    for class_name, confidence, x_center, y_center, width, height in detections:
        x1 = int((x_center - width/2) * w)
        y1 = int((y_center - height/2) * h)
        x2 = int((x_center + width/2) * w)
        y2 = int((y_center + height/2) * h)
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

        label = f"{class_name}"

        (text_width, text_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
        cv2.rectangle(img, (x1, y1-text_height-5), (x1+text_width, y1), (0, 255, 0), -1)
        cv2.putText(img, label, (x1, y1-5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1)

    return img

def create_score_objects(letters, attributes, scores):
    if len(letters) != len(attributes) or len(attributes) != len(scores):
        raise ValueError("The length of letters, attributes, and scores arrays must be the same")

    result = []
    total_score = 0
    added_attributes = set()

    for letter, attr, score in zip(letters, attributes, scores):
        if attr not in added_attributes:
            result.append({
                "code": letter,
                "attribute": attr,
                "confidence": int(score * 100)
            })
            added_attributes.add(attr)
            total_score += score

    average = int((total_score / len(added_attributes)) * 100) if added_attributes else 0
    result.append({"average": average})

    return result

@app.route('/detect', methods=['POST'])
def detect():
    temp_id = uuid.uuid4()
    try:
        clear_folder(ANNOTATED_FOLDER)
        data = request.json
        user_id = data['userId']
        image_urls = data['images']
        user_Id = user_id.split("/")[1]

        # Download and process images
        image_filenames = [f"{temp_id}_{user_Id}_{i}.jpeg" for i in range(len(image_urls))]
        image_paths = [os.path.join(IMAGES_FOLDER, filename) for filename in image_filenames]
        stitched_image_filename = f"{temp_id}_{user_Id}_stitched.jpeg"
        stitched_image_path = os.path.join(IMAGES_FOLDER, stitched_image_filename)

        # Clear previous detection runs
        detect_runs_path = os.path.join(YOLOV5_FOLDER, 'runs', 'detect')
        if os.path.exists(detect_runs_path):
            for folder in os.listdir(detect_runs_path):
                folder_path = os.path.join(detect_runs_path, folder)
                if os.path.isdir(folder_path):
                    shutil.rmtree(folder_path)

        # Download images
        for url, path in zip(image_urls, image_paths):
            response = requests.get(url)
            with open(path, 'wb') as f:
                f.write(response.content)

        # Create stitched image
        stitched_image = stitch_images(image_paths)
        cv2.imwrite(stitched_image_path, stitched_image)

        # Run detection
        try:
            command = f'python {DETECT_SCRIPT} --weights {WEIGHTS_PATH} --source {stitched_image_path} --save-txt --save-conf --hide-conf --data {DATA_YAML_PATH}'
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
        except Exception as e:
            return jsonify({'error': 'Please retake clear and closer image of face', 'details': str(e)}), 400
        print(result)
        if result.returncode != 0:
            return jsonify({'error': 'Detection Failed please try again', 'details': result.stdout}), 500

        # Process detection results
        exp_folder = os.path.join(YOLOV5_FOLDER, 'runs', 'detect', 'exp')
        txt_file_path = os.path.join(exp_folder, 'labels', os.path.splitext(stitched_image_filename)[0] + '.txt')

        if not os.path.exists(txt_file_path):
            return jsonify({'error': 'Could not extract attributes, take a closer and clear image of face'}), 500

        # Read detections
        detections = []
        with open(txt_file_path, 'r') as f:
            for line in f:
                class_id, x_center, y_center, width, height, confidence = map(float, line.strip().split())
                class_name = names[int(class_id)]
                detections.append((class_name, confidence, x_center, y_center, width, height))

        # Create annotated image
        annotated_image = annotate_image(stitched_image_path, detections)
        annotated_image_filename = f"annotated_{stitched_image_filename}"
        annotated_image_path = os.path.join(ANNOTATED_FOLDER, annotated_image_filename)
        cv2.imwrite(annotated_image_path, annotated_image)

        # Process attributes
        letters = [detection[0] for detection in detections]
        confidences = [detection[1] for detection in detections]
        attributes = [letter_to_attribute.get(letter, letter) for letter in letters]

        valid_keys = {
            'FINELINES': 'FINE_LINES',
            'Dark Spots': 'DARK_SPOTS',
            'Acne': 'ACNE',
            'COMEDONE': 'COMEDONE',
            'Wrinkle': 'WRINKLES',
            'Open Pores': 'OPEN_PORES',
            'Rashes': 'RASHES',
            'dark lips': 'DARK_LIPS',
            'eye bag': 'EYE_BAGS',
            'dark circle': 'DARK_CIRCLES',
            'skin_tags': 'SKIN_TAG',
            'pigmentation': 'PIGMENTATION',
            'skin bag': 'SKIN_BAG',
            'spot': 'SPOT',
            'uneven tone': 'UNEVEN_SKIN',
            'mole': 'MOLE',
            'patches': 'PATCHES',
            'melasma': 'MELASMA'
        }

        formatted_attributes = [valid_keys.get(attr, attr.upper()) for attr in attributes]
        attribute_confidences = create_score_objects(letters, formatted_attributes, confidences)

        # Upload annotated image
        payload = {
            "userId": user_id,
            "fileName": annotated_image_filename,
            "contentType": "image/jpeg"
        }
        signed_url_response = requests.post(API_SIGNED_URL, json=payload)
        signed_url_data = signed_url_response.json()
        upload_url = signed_url_data['data']['url']

        with open(annotated_image_path, 'rb') as f:
            upload_response = requests.put(upload_url, data=f)

        if upload_response.status_code != 200:
            return jsonify({'error': 'Failed to upload annotated image'}), 500

        final_attributes = list(set(formatted_attributes))
        final_url = upload_url.split("?")[0]

        result_payload = {
            "userId": user_id,
            "analysedImages": [{
                "fileName": annotated_image_filename,
                "url": final_url
            }],
            "attributes": final_attributes,
            "attributeCode": attribute_confidences[0:-1]
        }

        clear_folder(IMAGES_FOLDER)
        return jsonify(result_payload), 200

    except Exception as e:
        clear_folder(IMAGES_FOLDER)
        clear_folder(ANNOTATED_FOLDER)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)