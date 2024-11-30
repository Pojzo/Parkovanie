# Function to generate spot requests for a floor

from parking_app.schema.requests import CreateSpotRequest
import requests


def generate_spots_for_floor(floor_number, rows, cols, reserved_spots=None) -> list[CreateSpotRequest]:
    if reserved_spots is None:
        reserved_spots = []
    spots = []
    for row in range(0, rows):
        for col in range(0, cols):
            is_reserved = (row, col) in reserved_spots
            spots.append(CreateSpotRequest(
                floor_number=floor_number,
                spot_row=row,
                spot_col=col,
                lease_till=None,
            ))
    return spots

floor_plan_data = []
floor_plan_data += generate_spots_for_floor(1, 2, 3, reserved_spots=[(1, 3)])
floor_plan_data += generate_spots_for_floor(2, 3, 4, reserved_spots=[(2, 3), (3, 1)])
floor_plan_data += generate_spots_for_floor(3, 2, 5, reserved_spots=[(1, 4), (2, 5)])

floor_plan_as_list = [spot.dict() for spot in floor_plan_data]


# Create a new garage
response = requests.post("http://localhost:8000/garages", json={
    "name": "Test Garage",
    "location": "Test Location",
    "floors": 3,
    "num_rows": 3,
    "num_cols": 5,
})

garage_id = response.json()["data"]["garage_id"]

# Create spots for the garage
response = requests.post(f"http://localhost:8000/garages/{garage_id}/spots", json=floor_plan_as_list)