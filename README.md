# Simple API for Review

A fork from ayogatot's Review API for my [Review app](https://github.com/b1994mi/travling-test-src) using vue. This project uses node.js with express.js framework.

## Deployed version

I will deploy it soon on Heroku.

## Review Endpoint

| Endpoint      | HTTP   | Formdata Fields            | Body                                                             |
| ------------- | ------ | ---------------------- | ---------------------------------------------------------------- |
| `/review/`    | GET    | Get all review datas  |                                                                  |
| `/review/:id` | GET    | Get review data by Id  |                                                                  |
| `/review/`    | POST   | Create new review data, using formdata | `name` (String, required), `review_comment` (String, required) , `review_star` (Number, required, 1 - 5) , `images : file_upload` (File, optional, max 4 files) |
| `/review/:id` | PATCH  | Update review by id    | `name` (String, optional), `review_comment` (String, optional) , `review_star` (Number, optional,  1 - 5) , `images : file_upload` (File, optional, max 4 stored in db), `images_toBeDeleted` (Number || Number[], optional, contains the id of Images to be deleted and can be an array of numbers) |
| `/review/:id` | DELETE | Delete review by id    |                                                                  |

## About Endpoint

1. Using `PostgreSQL` to store data
2. The `images` data will be stored in PostgreSQL's bytea (BLOB).
3. Fetched data will be a blob with `buffer` column. The `images` data stucture is looks like :

```json
Images: [
    {
        "id": 1,
        "review_id": 2,
        "originalname": "EsSJ8kWU4AIsl4s.jpg",
        "size": 122708,
        "buffer": {
            "type": "Buffer",
            "data": [255, 216, 255, ...]
    }
]
```