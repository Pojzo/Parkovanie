import random
import string
from fastapi.testclient import TestClient
from parking_app.app import app

client = TestClient(app)


def test_create_garage_bad_params():
    # Bad parameters
    test_bodies = [
        {
            "name": "test",
            "location": "test",
        },
        {"location": "test", "floors": 3},
        {"name": "test", "floors": 3},
    ]
    for body in test_bodies:
        response = client.post("/garages", json=body)
        assert response.status_code == 422


def test_create_garage():
    # Good parameters
    test_bodies = [
        {"name": "test", "location": "test", "floors": 3},
        {"name": "test2", "location": "test2", "floors": 4},
    ]

    ids = []
    for body in test_bodies:
        response = client.post("/garages", json=body)
        print(response.json())
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["data"]["name"] == body["name"]
        assert response.json()["data"]["location"] == body["location"]
        assert response.json()["data"]["floors"] == body["floors"]
        assert response.json()["data"]["garage_id"] is not None
        ids.append(response.json()["data"]["garage_id"])

    # Clean up
    for garage_id in ids:
        response = client.delete(f"/garages/{garage_id}")
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["message"] == "Garage deleted"


def test_create_same_name():
    # Create a garage
    response = client.post(
        "/garages", json={"name": "test", "location": "test", "floors": 3}
    )
    assert response.status_code == 200
    garage_id = response.json()["data"]["garage_id"]

    # Create another garage with the same name
    response = client.post(
        "/garages", json={"name": "test", "location": "test", "floors": 3}
    )
    assert response.status_code == 409

    # Clean up
    response = client.delete(f"/garages/{garage_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["message"] == "Garage deleted"


def test_get_all_garages():
    random_location = lambda: "".join(random.choices(string.ascii_lowercase, k=10))
    random_name = lambda: "".join(random.choices(string.ascii_lowercase, k=10))
    random_floors = lambda: random.randint(1, 10)

    sample_data = [
        {
            "name": random_name(),
            "location": random_location(),
            "floors": random_floors(),
        }
        for _ in range(10)
    ]

    ids = []

    for data in sample_data:
        response = client.post("/garages", json=data)

    all_garages = client.get("/garages")

    assert all_garages.status_code == 200
    assert all_garages.json()["status"] == "success"
    assert len(all_garages.json()["data"]) == 10

    for garage in all_garages.json()["data"]:
        assert garage["name"] in [data["name"] for data in sample_data]
        assert garage["location"] in [data["location"] for data in sample_data]
        assert garage["floors"] in [data["floors"] for data in sample_data]
        ids.append(garage["garage_id"])

    # Clean up

    for garage_id in ids:
        response = client.delete(f"/garages/{garage_id}")
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["message"] == "Garage deleted"
