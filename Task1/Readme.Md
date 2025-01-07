# Task1 API

## Overview
This API allows you to manage events. You can create, read, update, and delete events.

## Endpoints

### GET /api/v3/app/events

#### Query Parameters
- `id` (optional): The ID of the event to retrieve.
- `type` (optional): The type of events to retrieve. Currently supports `latest`.
- `limit` (optional): The number of events to retrieve per page.
- `page` (optional): The page number to retrieve.

#### Example Request
```
GET /api/v3/app/events?type=latest&limit=10&page=1
```

#### Example Response
```json
[
  {
    "_id": "60c72b2f9b1e8b001c8e4d3b",
    "name": "Event Name",
    "tagline": "Event Tagline",
    "schedule": "2023-10-10T10:00:00.000Z",
    "description": "Event Description",
    "files": { "image": "image.jpg" },
    "moderator": "Moderator Name",
    "category": "Category",
    "sub_category": "Sub Category",
    "rigor_rank": 5,
    "attendees": []
  }
]
```

### POST /api/v3/app/events

#### Request Body
- `name` (required): The name of the event.
- `tagline` (required): The tagline of the event.
- `schedule` (required): The schedule of the event (ISO 8601 format).
- `description` (required): The description of the event.
- `moderator` (optional): The moderator of the event.
- `category` (optional): The category of the event.
- `sub_category` (optional): The sub-category of the event.
- `rigor_rank` (optional): The rigor rank of the event (integer).
- `files[image]` (required): The image file for the event.

#### Example Request
```
POST /api/v3/app/events
Content-Type: multipart/form-data

{
  "name": "Event Name",
  "tagline": "Event Tagline",
  "schedule": "2023-10-10T10:00:00.000Z",
  "description": "Event Description",
  "moderator": "Moderator Name",
  "category": "Category",
  "sub_category": "Sub Category",
  "rigor_rank": 5,
  "files[image]": <image file>
}
```

#### Example Response
```json
{
  "id": "60c72b2f9b1e8b001c8e4d3b",
  "event": {
    "name": "Event Name",
    "tagline": "Event Tagline",
    "schedule": "2023-10-10T10:00:00.000Z",
    "description": "Event Description",
    "files": { "image": "image.jpg" },
    "moderator": "Moderator Name",
    "category": "Category",
    "sub_category": "Sub Category",
    "rigor_rank": 5,
    "attendees": []
  }
}
```

### PUT /api/v3/app/events/:id

#### Request Parameters
- `id` (required): The ID of the event to update.

#### Request Body
- `name` (optional): The name of the event.
- `tagline` (optional): The tagline of the event.
- `schedule` (optional): The schedule of the event (ISO 8601 format).
- `description` (optional): The description of the event.
- `moderator` (optional): The moderator of the event.
- `category` (optional): The category of the event.
- `sub_category` (optional): The sub-category of the event.
- `rigor_rank` (optional): The rigor rank of the event (integer).
- `files[image]` (optional): The image file for the event.

#### Example Request
```
PUT /api/v3/app/events/60c72b2f9b1e8b001c8e4d3b
Content-Type: multipart/form-data

{
  "name": "Updated Event Name",
  "tagline": "Updated Event Tagline",
  "schedule": "2023-10-11T10:00:00.000Z",
  "description": "Updated Event Description",
  "moderator": "Updated Moderator Name",
  "category": "Updated Category",
  "sub_category": "Updated Sub Category",
  "rigor_rank": 6,
  "files[image]": <updated image file>
}
```

#### Example Response
```json
{
  "message": "Event updated successfully"
}
```

### DELETE /api/v3/app/events/:id

#### Request Parameters
- `id` (required): The ID of the event to delete.

#### Example Request
```
DELETE /api/v3/app/events/60c72b2f9b1e8b001c8e4d3b
```

#### Example Response
```json
{
  "message": "Event deleted successfully"
}
```

## Error Handling
All endpoints return an error response in the following format:
```json
{
  "error": true,
  "message": "Error message"
}
```