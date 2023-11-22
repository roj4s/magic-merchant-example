import uuid
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView, status
import os
import requests
from random import random
from time import sleep

temp = {
        "id": 0,
        "transaction_uuid": f"sc-{uuid.uuid4()}",
        "dwolla_transaction_id": "0a9ea104-4730-ee11-8153-fa714224061e",
        "amount": 50.0,
        "user_id": "a4f59f40f61b4e4ba068f7a97f0b2bf8",
        "consumer_transaction_id": "fa4eb81f-0f0d-4865-8245-871b3909582b",
        "merchant_transaction_id": "035e7634-ef70-4545-8235-03482ae5df67",
        "checkout_id": 29,
        "transaction_status": "pending",
        "transaction_date_time": "2023-08-01T08:40:11.206201Z",
        "description": None,
        "error": None,
        "created_at": "2023-08-01T08:40:11.206232Z",
        "updated_at": "2023-08-01T08:40:11.206243Z"}

data = []

for i in range(20):
    w = {}
    for k in temp:
        w[k] = temp[k]
        w["id"] = i
        w["transaction_uuid"] = f"sc-{uuid.uuid4()}" 
        w["transaction_status"] = "completed" if random() < 0.5 else "pending"
        w["amount"] = random() * 200
        w["refund"] = None if random() < 0.5 else {"id": uuid.uuid4(),"status": "approved" if random() < 0.5 else "pending"}

    data.append(w)

def success_mock():
    sleep(3)
    return JsonResponse({"success": True}, safe=False)


class GetPurchasesListView(APIView):

    def mock(self):
        return JsonResponse(data, safe=False)

    def get(self, req, auth_token):
        return self.mock()
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/merchants/manage_subscription/get_subscription_details/"

        print("magic-url", url)
        print("token", magic_key)
        resp = requests.get(
            url, headers={"api-key": magic_key, "Authorization": f"Token {auth_token}"}
        )
        if not (resp.status_code == 200 or resp.status_code == 201):
            return JsonResponse({"error": "couldnt get purchases"}, status=500)

        refund_url = f"{magic_api_url}/api/merchants/refund_request/consumer_refund_list"

        refund_resp = requests.get(
            refund_url, headers={"api-key": magic_key, "Authorization": f"Token {auth_token}"})

        if not (refund_resp.status_code == 200 or refund_resp.status_code == 201):
            return JsonResponse({"error": "couldnt get refunds"}, status=500)

        purchases_aux = resp.json()
        refunds = refund_resp.json()
        purchases = []

        for p in purchases_aux:
            p['refund'] = None
            for ref in refunds:
                if ref.transaction_uuid == p.transaction_uuid:
                    p['refund'] = ref
                    break

            purchases.append(p)

        return JsonResponse(purchases, status=resp.status_code)


class RequestRefundView(APIView):

    def post(self, req, auth_token, transaction_uuid):
        return success_mock()
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/merchants/refund_request/consumer_refund_request"

        resp = requests.post(
            url, headers={"api-key": magic_key, "Authorization": f"Token {auth_token}"}, json={"transaction_uuid": transaction_uuid}
        )
        return JsonResponse(resp.json(), status=resp.status_code)


class ListRefundsView(APIView):

    def mock(self):
        return JsonResponse(data[:4], safe=False);

    def get(self, req, auth_token):
        return self.mock()
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/merchants/refund_request/consumer_refund_list"

        resp = requests.get(
            url, headers={"api-key": magic_key, "Authorization": f"Token {auth_token}"})

        return JsonResponse(resp.json(), status=resp.status_code)


class RefundStatusView(APIView):

    def post(self, req):
        return success_mock()
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/merchants/refund_request/merchant_status_refund_request"

        resp = requests.post(
            url,
            headers={"api-key": magic_key, "Authorization": f"Token {req.data['auth_token']}"},
            json={"id": req.data["id"], "status": req.data["status"]})

        return JsonResponse(resp.json(), status=resp.status_code)

class InitiateRefundView(APIView):

    def post(self, req):
        return success_mock()
        magic_api_url = os.environ["MAGIC_URL"]
        magic_key = os.environ["MAGIC_API_KEY"]
        url = f"{magic_api_url}/api/merchants/refund_request/initiate_refund_transfer"

        resp = requests.post(url, 
            headers={"api-key": magic_key, "Authorization": f"Token {req.data['auth_token']}"}, 
            json={"id": req.data["id"], "status": "approved"})

        return JsonResponse(resp.json(), status=resp.status_code)
