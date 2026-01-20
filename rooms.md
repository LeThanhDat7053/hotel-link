vr-hotel


GET
/api/v1/vr-hotel/settings
Get Vr Hotel Settings


Get VR Hotel settings for a property (VR-specific only) Basic info should be read from properties table

Requires headers:

X-Tenant-Code: Tenant code
X-Property-Id: Property ID
Parameters
Cancel
Name	Description
x-tenant-code
string | (string | null)
(header)
fusion
x-property-id
integer | (integer | null)
(header)
10
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://travel.link360.vn/api/v1/vr-hotel/settings' \
  -H 'accept: application/json' \
  -H 'x-tenant-code: fusion' \
  -H 'x-property-id: 10' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njk0OTk1MDUsInN1YiI6IjIzIn0.ugTHPozqShY0InF0dJSsxJB65XoTfzeFaDDIirf0WZQ'
Request URL
https://travel.link360.vn/api/v1/vr-hotel/settings
Server response
Code	Details
200	
Response body
Download
{
  "primary_color": "#ecc56d",
  "logo_media_id": 132,
  "favicon_media_id": 134,
  "seo": {
    "vi": {
      "meta_title": "Khách Sạn Cao Cấp - Trải Nghiệm Lưu Trú Đẳng Cấp 5 Sao",
      "meta_description": "Khám phá không gian nghỉ dưỡng sang trọng với phòng nghỉ hiện đại, ẩm thực tinh tế, dịch vụ chu đáo và tour VR360 độc đáo. Đặt phòng ngay hôm nay!",
      "meta_keywords": "khách sạn, hotel, phòng nghỉ, đặt phòng, luxury hotel, resort, VR360"
    }
  },
  "pages": {
    "rooms": {
      "vr_title": "vr 360",
      "vr360_link": "https://nhahanglamduong.vt360.vn/"
    },
    "dining": {
      "vr_title": "vt",
      "vr360_link": "https://web-homaypark.vt360.vn/"
    },
    "services": {
      "vr_title": "",
      "vr360_link": "https://nhamatamnhung.vt360.vn/"
    },
    "facilities": {
      "vr_title": "vr",
      "vr360_link": "https://phucdathotel.vt360.vn/"
    }
  }
}
Response headers
 cache-control: no-cache,no-store,must-revalidate 
 connection: keep-alive 
 content-length: 793 
 content-type: application/json 
 date: Mon,19 Jan 2026 09:37:45 GMT 
 expires: 0 
 pragma: no-cache 
 server: nginx/1.18.0 (Ubuntu) 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "primary_color": "#3b82f6",
  "logo_media_id": 0,
  "favicon_media_id": 0,
  "seo": {
    "additionalProp1": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    },
    "additionalProp2": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    },
    "additionalProp3": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  },
  "pages": {
    "additionalProp1": {}
  }
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}