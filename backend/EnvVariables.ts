import table from "cli-table"

let tableData = new table();

let enviromentVariables: any = {
  "MONGODB_URL": {
    "message": "Required mongodb url",
    "optional": false
  },
  "ACCESS_TOKEN_SECRET": {
    "message": "Required Access token secret",
    "optional": false
  },
  "SALT_ROUNDS": {
    "message": "Required salt rounds for encryption",
    "optional": false
  },
  "REDIS_PORT": {
    "message": "Required redis PORT",
    "optional": true
  },
  "REDIS_HOST": {
    "message": "Required redis HOST",
    "optional": true
  },
  "REDIS_URL": {
    "message": "Required redis URL",
    "optional": true
  },
  "DEFAULT_OTP_EXPIRY": {
    "message": "Required login OTP expiry time in S",
    "optional": true
  },
  "AWS_ACCESS_KEY_ID": {
    "message": "Required AWS access key ID",
    "optional": true
  },
  "AWS_SECRET_ACCESS_KEY": {
    "message": "Required AWS secret access key",
    "optional": true
  },
  "AWS_BUCKET": {
    "message": "Required AWS bucket name",
    "optional": true
  },
  "AWS_DEFAULT_REGION": {
    "message": "Required AWS region",
    "optional": true
  },
}

let success = true;

export default function () {
  Object.keys(enviromentVariables).forEach(eachEnvironmentVariable => {

    let tableObj = {
      [eachEnvironmentVariable]: "PASSED"
    };

    let keyCheckPass = true;


    if (enviromentVariables[eachEnvironmentVariable].optional === true
      && enviromentVariables[eachEnvironmentVariable].requiredIf
      && enviromentVariables[eachEnvironmentVariable].requiredIf.key
      && enviromentVariables[eachEnvironmentVariable].requiredIf.key != ""
      && enviromentVariables[eachEnvironmentVariable].requiredIf.operator
      && enviromentVariables[eachEnvironmentVariable].requiredIf.value
      && enviromentVariables[eachEnvironmentVariable].requiredIf.value != "") {
      switch (enviromentVariables[eachEnvironmentVariable].requiredIf.operator) {
        case "EQUALS":
          if (process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] === enviromentVariables[eachEnvironmentVariable].requiredIf.value) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        case "NOT_EQUALS":
          if (process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] != enviromentVariables[eachEnvironmentVariable].requiredIf.value) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        default:
          break;
      }
    }

    if (enviromentVariables[eachEnvironmentVariable].optional === false) {
      if (!(process.env[eachEnvironmentVariable])
        || process.env[eachEnvironmentVariable] == "") {
        success = false;
        keyCheckPass = false;
      } else if (enviromentVariables[eachEnvironmentVariable].possibleValues
        && Array.isArray(enviromentVariables[eachEnvironmentVariable].possibleValues)
        && enviromentVariables[eachEnvironmentVariable].possibleValues.length > 0) {
        if (!enviromentVariables[eachEnvironmentVariable].possibleValues.includes(process.env[eachEnvironmentVariable])) {
          success = false;
          keyCheckPass = false;
          enviromentVariables[eachEnvironmentVariable].message += ` Valid values - ${enviromentVariables[eachEnvironmentVariable].possibleValues.join(", ")}`
        }
      }
    }

    if ((!(process.env[eachEnvironmentVariable])
      || process.env[eachEnvironmentVariable] == "")
      && enviromentVariables[eachEnvironmentVariable].default
      && enviromentVariables[eachEnvironmentVariable].default != "") {
      process.env[eachEnvironmentVariable] = enviromentVariables[eachEnvironmentVariable].default;
    }

    if (!keyCheckPass) {
      if (enviromentVariables[eachEnvironmentVariable].message !== "") {
        tableObj[eachEnvironmentVariable] =
          enviromentVariables[eachEnvironmentVariable].message;
      } else {
        tableObj[eachEnvironmentVariable] = `FAILED - ${eachEnvironmentVariable} is required`;
      }
    }

    tableData.push(tableObj);
  })

  console.log(tableData.toString());

  return {
    success: success
  }
}
