import subprocess
import tempfile
import json
import sys

data = json.loads(sys.stdin.read())
user_code = data["code"]
test_cases = data["testCases"]

passed = 0
total = len(test_cases)

def normalize(s):
    return s.replace("\r\n", "\n").replace("\r", "").strip()

for tc in test_cases:
    # Inject input into code
    injected_code = f"import sys\n" \
                    f"sys.stdin = open('input.txt')\n" \
                    f"{user_code}"

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as f:
        f.write(injected_code)
        f.flush()
        temp_code_path = f.name

    # Write input to a file
    with open("input.txt", "w") as input_file:
        input_file.write(tc["input"])

    try:
        result = subprocess.run(
            ["python", temp_code_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=2
        )

        output = normalize(result.stdout)
        expected = normalize(tc["expected_output"])

        if output == expected:
            passed += 1

    except subprocess.TimeoutExpired:
        pass
    finally:
        import os
        os.remove(temp_code_path)
        os.remove("input.txt")

response = {
    "passed": passed,
    "total": total
}

print(json.dumps(response))