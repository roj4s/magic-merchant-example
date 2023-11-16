from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
import os
import requests
from magicmerchant.models import Order


class CheckoutAPI(APIView):
    def post(self, req):
        isSandbox = bool(req.data["isSandbox"])
        magic_api_url = os.environ["MAGIC_URL"] if isSandbox else os.environ["MAGIC_URL_PROD"]
        magic_key = os.environ["MAGIC_API_KEY"] if isSandbox else os.environ["MAGIC_API_KEY_PROD"]
        print("magic_url", magic_api_url)
        print("isSandbox", isSandbox)
        checkout_url = f"{magic_api_url}/api/merchants/checkout"
        checkout_resp = requests.post(
            checkout_url, json=req.data, headers={"api-key": magic_key}
        )
        print(checkout_resp.json())
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
    def get(self, req, checkout_id, link_token, isSandbox):
        magic_key = os.environ["MAGIC_API_KEY"] if bool(isSandbox) else os.environ["MAGIC_API_KEY_PROD"]
        magic_api_url = os.environ["MAGIC_URL"] if bool(isSandbox) else os.environ["MAGIC_URL_PROD"]
        print("Checkout id", checkout_id)
        print("Link token", link_token)
        checkout_url = (
            f"{magic_api_url}/api/merchants/payment_preprocess/get_processor_token/"
        )
        checkout_resp = requests.post(
            checkout_url,
            json={"checkout_id": checkout_id},
            headers={"api-key": magic_key},
        )

        checkout_data = checkout_resp.json()
        """
        Order(
            checkout_id=checkout_id,
            link_token=link_token,
            transaction_id=checkout_data["transaction_id"],
        ).save()
        """
        print(checkout_data)
        resp = JsonResponse(checkout_data)
        if checkout_resp.status_code not in (200, 201):
            resp.status_code = 400

        return JsonResponse(checkout_data)
