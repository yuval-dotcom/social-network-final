# Social Network Final Project

פרויקט גמר בקורס Android 2: רשת חברתית מלאה עם שרת Node.js, מסד MongoDB וצד לקוח React.

## סטאק מתוכנן

- Server: Node.js + Express
- Database: MongoDB + Mongoose
- Client: React Web
- Ajax: jQuery Ajax
- Realtime chat: Socket.io
- Charts: D3.js
- Architecture: MVC

## מודלים ראשונים

- User
- Group
- Post

## הרצה

1. מתקינים תלויות:

```bash
npm install --prefix server
npm install --prefix client
```

2. יוצרים קובץ `.env` לפי `.env.example`.

3. מריצים seed לנתוני דמו:

```bash
npm --prefix server run seed
```

4. מריצים שרת ולקוח בשני טרמינלים:

```bash
npm run dev:server
npm run dev:client
```

5. מריצים בדיקות:

```bash
npm test
```

## משתמשי דמו

כל משתמשי הדמו נוצרים עם הסיסמה:

```text
demo123
```
