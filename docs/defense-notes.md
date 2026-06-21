# StudyCircle - נקודות להסבר בהגנה

## ארכיטקטורה

הפרויקט מחולק לשרת ולקוח:

- `server`: Node.js + Express.
- `client`: React רגיל עם Vite.
- `MongoDB Atlas`: מסד הנתונים.

בשרת יש הפרדה לפי MVC:

- Model: הגדרת מבנה ולידציה של `User`, `Group`, `Post`.
- Controller: טיפול בבקשות HTTP.
- Routes: חיבור כתובות API לפונקציות controller.
- Repository: עבודה מול MongoDB native driver.

## שלושת המודלים הרשמיים

1. `User`
   - יצירה דרך הרשמה.
   - רשימה, חיפוש, עדכון ומחיקה דרך מסך משתמשים.

2. `Group`
   - יצירה, רשימה, חיפוש, עדכון ומחיקה דרך מסך קבוצות.
   - מנהל קבוצה יכול לאשר משתמשים.

3. `Post`
   - יצירה, רשימה, חיפוש, עדכון ומחיקה דרך מסך פוסטים.
   - משתמש יכול לערוך ולמחוק רק פוסטים שלו.

## Auth והרשאות

- סיסמאות נשמרות כ-hash באמצעות `bcrypt`.
- אחרי התחברות השרת מחזיר JWT.
- הלקוח שומר את ה-JWT ושולח אותו בכל בקשה דרך `Authorization` header.
- השרת בודק את ה-token ב-middleware.

## jQuery Ajax

למרות שה-UI כתוב ב-React, כל הקריאות לשרת עוברות דרך `$.ajax` בקובץ אחד:

```text
client/src/api/http.js
```

זה עונה לדרישת שימוש ב-jQuery Ajax.

## Socket.io Chat

- הלקוח שולח `chat:send`.
- השרת שומר את ההודעה ב-MongoDB.
- השרת מפיץ `chat:message` לכל מי שנמצא באותו room.

## D3.js

יש שני גרפים:

- פוסטים לפי חודש.
- פוסטים לפי קבוצה.

הנתונים מגיעים מהשרת, והשרת מחשב אותם מתוך הפוסטים והקבוצות במסד.

## CSS3, Video, Canvas

הפרויקט כולל:

- `text-shadow`
- `transition`
- `multiple-columns`
- `@font-face`
- `border-radius`
- רכיב `video`
- רכיב `canvas`

## בדיקות

יש בדיקות אוטומטיות לשרת וללקוח:

```bash
npm test
```

הבדיקות מכסות Auth, מודלים, repositories, controllers, Ajax, UI, Chat, D3 ו-Media.
