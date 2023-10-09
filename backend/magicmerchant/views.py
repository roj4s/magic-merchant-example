from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
import os
import requests
import json


class CheckoutAPI(APIView):
    def get(self, req):
        data = json.load(open(f"{os.path.dirname(__file__)}/data.json", "rt"))
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        checkout_url = f"{magic_api_url}/api/merchants/checkout"
        checkout_resp = requests.post(
            checkout_url, json=data, headers={"api-key": magic_key}
        )
        if checkout_resp.status_code in (200, 201):
            checkout_data = checkout_resp.json()
            checkout_id = checkout_data["id"]
            link_token_url = f"{magic_api_url}/api/merchants/checkout/{checkout_id}/generate_link_token"
            link_token_resp = requests.get(
                link_token_url, headers={"api-key": magic_key}
            )
            if link_token_resp.status_code in (200, 201):
                return JsonResponse(link_token_resp.json())

        return Response(checkout_resp.content, status=400)
