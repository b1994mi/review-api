# Simple API for Review

A fork from ayogatot's Review API.

## Review Endpoint

| Endpoint      | HTTP   | Description            | Body                                                             |
| ------------- | ------ | ---------------------- | ---------------------------------------------------------------- |
| `/review/`    | GET    | Get all review datas   |                                                                  |
| `/review/:id` | GET    | Get review data by Id  |                                                                  |
| `/review/`    | POST   | Create new review data | `name`, `review_comment` , `review_star` , `iamge : file_upload` |
| `/review/:id` | PATCH  | Update review by id    | `name`, `review_comment` , `review_star` , `iamge : file_upload` |
| `/review/:id` | DELETE | Delete review by id    |                                                                  |

## About Endpoint

1. Using `PostgreSQL` to store data
2. The `images` data will be stored in PostgreSQL's bytea (BLOB).
3. Fetched data will be a blob with `buffer` column. The `images` data stucture is looks like :

```json
{
"id": 1,
"review_id": 2,
"originalname": "EsSJ8kWU4AIsl4s.jpg",
"size": 122708,
"buffer": {
    "type": "Buffer",
    "data": [255, 216, 255, ...]
}
```