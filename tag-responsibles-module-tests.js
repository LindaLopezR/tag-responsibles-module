// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by tag-responsibles-module.js.
import { name as packageName } from "meteor/tag-responsibles-module";

// Write your tests here!
// Here is an example.
Tinytest.add('tag-responsibles-module - example', function (test) {
  test.equal(packageName, "tag-responsibles-module");
});
