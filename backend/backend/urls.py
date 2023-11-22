"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include, path
from magicmerchant.views.checkout import CheckoutAPI, CompleteCheckoutAPI
from magicmerchant.views.refund import GetPurchasesListView, InitiateRefundView, ListRefundsView, RefundStatusView, RequestRefundView
from magicmerchant.views.user_verification import SendOTPCodeView, VerifyOTPCodeView

urlpatterns = [
    path(
        "api/complete_checkout/<str:checkout_id>/<str:link_token>/<str:isSandbox>",
        CompleteCheckoutAPI.as_view(),
    ),
    path("api/checkout", CheckoutAPI.as_view()),
    path("api/send_code/<str:phone>", SendOTPCodeView.as_view()),
    path("api/verify_code/<str:phone>/<str:otp>", VerifyOTPCodeView.as_view()),
    path("api/purchases/<str:auth_token>", GetPurchasesListView.as_view()),
    path("api/refund/<str:auth_token>/<str:transaction_uuid>", RequestRefundView.as_view()),
    path("api/listrefunds/<str:auth_token>", ListRefundsView.as_view()),
    path("api/setrefundstatus", RefundStatusView.as_view()),
    path("api/initiaterefund", InitiateRefundView.as_view()),
    path("admin/", admin.site.urls),
]
