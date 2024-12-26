import boto3
from dotenv import load_dotenv
load_dotenv()
import os
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID') #Change the credentials
region_name=os.getenv('AWS_DEFAULT_REGION')
aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
bucket_name = os.getenv('AWS_BUCKET')
s3 = boto3.client('s3',
                  aws_access_key_id= aws_access_key_id,
                  aws_secret_access_key=aws_secret_access_key,
                  region_name= region_name,)

s3.download_file(bucket_name, 'yolov5_detection_model/best.pt', 'best.pt')