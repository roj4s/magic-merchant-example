from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
import os
import requests


class CheckoutAPI(APIView):
    def post(self, req):
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        print(magic_api_url)
        checkout_url = f"{magic_api_url}/api/merchants/checkout"
        checkout_resp = requests.post(
            checkout_url, json=req.data, headers={"api-key": magic_key}
        )
        print(checkout_resp)
        if checkout_resp.status_code in (200, 201):
            checkout_data = checkout_resp.json()
            checkout_id = checkout_data["id"]
            link_token_url = f"{magic_api_url}/api/merchants/checkout/{checkout_id}/generate_link_token"
            link_token_resp = requests.get(
                link_token_url, headers={"api-key": magic_key}
            )
            print(link_token_resp.json())
            if link_token_resp.status_code in (200, 201):
                return JsonResponse(link_token_resp.json())

        return Response(checkout_resp.content, status=400)


class CompleteCheckoutAPI(APIView):
    def get(self, req):
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        checkout_id = req.params.checkout_id
        checkout_url = (
            f"{magic_api_url}/api/merchants/payment_preprocess/get_processor_token/"
        )
        checkout_resp = requests.post(
            checkout_url,
            json={checkout_id: checkout_id},
            headers={"api-key": magic_key},
        )

        checkout_data = checkout_resp.json()
        resp = JsonResponse(checkout_data)
        if checkout_resp.status_code not in (200, 201):
            resp.status_code = 400

        return JsonResponse(checkout_data)
