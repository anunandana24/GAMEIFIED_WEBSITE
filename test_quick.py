from app import app
c = app.test_client()
for route in ['/', '/arcade', '/boss', '/sandbox', '/certificate']:
    r = c.get(route)
    print(route, r.status_code)
