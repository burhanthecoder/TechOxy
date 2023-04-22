import datetime

x = datetime.datetime.now()

print(datetime.datetime.now())

# datetime in this 2019-07-24 11:11 format
print(x.strftime("%Y-%m-%d %H:%M"))
print(x.strftime("%Y-%m-%d %H:%M:%S"))
# def generate_random_id():
   
    # return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))