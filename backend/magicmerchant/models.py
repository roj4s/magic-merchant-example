from django.db import models


class Order(models.Model):
    date = models.DateField(auto_now=True)
    checkout_id = models.CharField(max_length=20)
    link_token = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=20)
