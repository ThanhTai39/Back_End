# So sánh ES5 vs ES6

## 1. Khai báo biến

| ES5 | ES6 |
|-----|-----|
| `var` | `let`, `const` |

```js
// ES5
var name = "Tài";
var name = "Khác"; // OK, không báo lỗi

// ES6
let age = 25;
age = 26;           // OK, gán lại được
const PI = 3.14;
PI = 3;             // Lỗi! const không gán lại được
```

**Khác biệt chính:** `var` có function scope và hoisting, `let`/`const` có block scope và không hoisting.

---

## 2. Arrow Function

```js
// ES5
var add = function(a, b) {
  return a + b;
};

// ES6
const add = (a, b) => a + b;
```

```js
// ES5
var self = this;
setTimeout(function() {
  console.log(self.name); // phải lưu this ra biến phụ
}, 1000);

// ES6 — arrow function tự bind this từ context ngoài
setTimeout(() => {
  console.log(this.name); // this giữ nguyên
}, 1000);
```

---

## 3. Template Literals

```js
// ES5
var msg = "Xin chào " + name + ", bạn " + age + " tuổi!";

// ES6
const msg = `Xin chào ${name}, bạn ${age} tuổi!`;
```

---

## 4. Destructuring

```js
// ES5
var user = { name: "Tài", age: 25 };
var name = user.name;
var age = user.age;

// ES6
const { name, age } = user;

// Với array
const colors = ["red", "green", "blue"];
// ES5
var first = colors[0];
// ES6
const [first, second] = colors;
```

---

## 5. Module (Import/Export)

```js
// ES5 — CommonJS
var express = require("express");
module.exports = app;

// ES6 — ESM
import express from "express";
export default app;
```

```js
// Named exports
// ES5
exports.add = function(a, b) { return a + b; };
var math = require("./math");
math.add(1, 2);

// ES6
export const add = (a, b) => a + b;
import { add } from "./math.js";
```

---

## 6. Class

```js
// ES5 — Constructor function + prototype
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + " speaks");
};
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// ES6
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} speaks`);
  }
}
class Dog extends Animal {
  constructor(name) {
    super(name);
  }
}
```

---

## 7. Promise

```js
// ES5 — Callback hell
fetchUser(function(user) {
  fetchPosts(user.id, function(posts) {
    fetchComments(posts[0].id, function(comments) {
      console.log(comments);
    });
  });
});

// ES6 — Promise chain
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments));

// ES2017+ — async/await (dựa trên Promise)
async function loadData() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  console.log(comments);
}
```

---

## 8. Default Parameters

```js
// ES5
function greet(name) {
  name = name || "Khách";
  console.log("Xin chào " + name);
}

// ES6
function greet(name = "Khách") {
  console.log(`Xin chào ${name}`);
}
```

---

## 9. Spread / Rest Operator

```js
// Merge array
// ES5
var merged = [1, 2].concat([3, 4]);

// ES6
const merged = [...[1, 2], ...[3, 4]];

// Clone object
// ES5
var clone = Object.assign({}, user);

// ES6
const clone = { ...user };

// Rest parameters
// ES5
function sum() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(a, b) { return a + b; }, 0);
}

// ES6
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
```

---

## 10. Map / Set

```js
// ES5 — Dùng object giả lập map
var map = {};
map["key"] = "value";
delete map["key"];

// ES6
const map = new Map();
map.set("key", "value");
map.get("key");
map.delete("key");

const set = new Set([1, 2, 3, 3]); // Set {1, 2, 3} — tự loại trùng
```

---

## 11. for...of

```js
// ES5
var arr = [10, 20, 30];
for (var i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// ES6
for (const val of arr) {
  console.log(val);
}
```

---

## 12. Tóm tắt nhanh

| Tính năng | ES5 | ES6 |
|-----------|-----|-----|
| Khai báo biến | `var` | `let`, `const` |
| Hàm | `function() {}` | `() => {}` |
| Chuỗi | `"a" + b` | `` `a ${b}` `` |
| Module | `require` / `module.exports` | `import` / `export` |
| Class | Constructor + prototype | `class` / `extends` |
| Bất đồng bộ | Callback | Promise → async/await |
| Tham số mặc định | `x = x \|\| default` | `x = default` |
| Spread/Rest | `concat`, `arguments` | `...` |
| Destructuring | Gán thủ công | `{ a, b } = obj` |
