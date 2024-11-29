# from fastapi.testclient import TestClient
# from parking_app.app import app

# client = TestClient(app)

# def test_create_spot_bad_params():
#     # Bad parameters
#     test_bodies = [
#         {
#             "spot_row": 1,
#             "spot_col": 1
#         },
#         {
#             "spot_row": 1,
#             "floor_number": 1
#         },
#         {
#             "spot_col": 1,
#             "floor_number": 1
#         },
#     ]

#     for body in test_bodies:
#         response = client.post("/spots", json=body)
#         assert response.status_code == 422