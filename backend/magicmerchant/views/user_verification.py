from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView, status
import os
import requests


class SendOTPCodeView(APIView):
    def get(self, req, phone):
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/verify_user/send_code"

        print("magic-url", url)
        print("token", magic_key)
        resp = requests.post(
            url, json={"phone": phone}, headers={"api-key": magic_key}
        )
        return JsonResponse(resp.json(), status=resp.status_code)


class VerifyOTPCodeView(APIView):
    def get(self, req, phone, otp):
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/verify_user/verify_code"
        resp = requests.post(
            url, json={"phone": phone, "verification_code": otp}, headers={"api-key": magic_key}
        )
        return JsonResponse(resp.json(), status=resp.status_code)

