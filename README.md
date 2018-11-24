# simple-web-crawlers

This is a sample project to explain about 'How to write web crawlers' in my technical documents.

This repository contains simple and small sample tools. They can work, but is not for a general use. Most of them have a single function, a single target or a single purpose, because you can understand them easily.

Please feel free to copy and modify all of them.

# Sample tools

## list-ibm-patterns

This is a sample code to make a contents list from a web page which has 'paged' function in the list module. And this tool's target is only;

* [IBM Developer: Code Patterns](https://developer.ibm.com/jp/patterns/)

It's very simple, and is maybe good startpoint for beginners to learn the code of web crawlers in Node.JS environment.

## list-ibmjp-patterns

This is almost same as 'list-ibm-patterns' tool. But the target site is changed to:

* [IBM Developer Japan: Code Patterns](https://developer.ibm.com/jp/patterns/)

## nedb2json

This is a (a little bit) useful tool to convert a nedb file to a json file. The following is a sample:

```
node nedb2json list-ibm-patterns.nedb > list-ibm-patterns.json
node nedb2json list-ibmjp-patterns.nedb > list-ibmjp-patterns.json
```