# Social Network Final Project

פרויקט גמר בקורס Android 2: רשת חברתית מלאה עם שרת Node.js, מסד MongoDB וצד לקוח React.

## סטאק מתוכנן

- Server: Node.js + Express
- Database: MongoDB Atlas + MongoDB native driver
- Client: React Web 19.2.x
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

דוגמה למבנה הקובץ:

```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_MODE=mongo
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/studycircle
MONGO_DB_NAME=studycircle
MONGO_SERVER_SELECTION_TIMEOUT_MS=5000
MONGO_URI_TEST=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/studycircle_test
JWT_SECRET=replace-with-a-long-random-secret
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

חשוב: לא מעלים את `.env` ל-GitHub. הקובץ כבר חסום ב-`.gitignore`.

אם Atlas לא זמין בזמן פיתוח מקומי, אפשר להריץ דמו זמני עם `DATABASE_MODE=memory`.
ברירת המחדל וההגשה נשארות `DATABASE_MODE=mongo`.

## יצירת MongoDB Atlas

1. נכנסים ל-MongoDB Atlas ויוצרים פרויקט חדש.
2. יוצרים Cluster חינמי.
3. יוצרים Database User עם שם משתמש וסיסמה.
4. ב-Network Access מוסיפים את כתובת ה-IP שלך. לפיתוח בלבד אפשר לפתוח זמנית ל-`0.0.0.0/0`, אבל להגשה עדיף לצמצם.
5. לוחצים Connect ומעתיקים connection string מסוג Drivers.
6. מחליפים ב-connection string את `<password>` בסיסמה של המשתמש.
7. שמים את המחרוזת ב-`MONGO_URI` בתוך `.env`.

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

## React בפרויקט

זה React Web רגיל, לא React Native. הפרויקט משתמש ב-React 19.2.x בצד הלקוח, ו-Vite משמש רק ככלי פיתוח והרצה.

הקוד נשמר פשוט: קומפוננטות פונקציונליות, `useState` לניהול state מקומי, `useEffect` לטעינת נתונים, וקובץ API אחד שמרכז את קריאות jQuery Ajax לשרת.
