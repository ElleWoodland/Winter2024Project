var express = require('express');
var router = express.Router();

let serverArray = [];

let BucketListObject = function (pName, pNumber) {
  this.Name = pName;
  this.Number = pNumber;
  //this.ID = array.length +1;
};

var fs = require("fs");

let fileManager = {
  read: function () {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
  },

  write: function () {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync('objectdata.json', data);

  },

  validData: function () {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if (rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

if (!fileManager.validData()) {
  serverArray.push(new BucketListObject("test", 1));
  serverArray.push(new BucketListObject("test1", 2));
  serverArray.push(new BucketListObject("test2", 3));
  fileManager.write();
}
else {
  fileManager.read(); // do have prior bucket list items so load up the array
}


/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile('index');
});

/* GET all bucket list data */
router.get('/getAllBucketListItems', function (req, res) {
  fileManager.read();
  res.status(200).json(serverArray);
})

/* Add one new bucket list item */
router.post('/AddBucketListItem', function (req, res) {
  const newBucketListItem = req.body;
  console.log(newBucketListItem);
  serverArray.push(newBucketListItem);
  fileManager.write();
  res.status(200).json(newBucketListItem);
})

// Add route for delete
router.delete('DeleteBucketListItem/:ID', (req, res) => {
  const delID = req.params.ID;
  console.log(delID);
  let found = false;
  let pointer = GetArrayPointer(delID);
  if (pointer == -1) {
    console.log("not found");
    return res.status(500).json({
      status: "error - no such ID"
    });
  }
  else {
    serverArray.splice(pointer, 1);
    fileManager.write();
    res.send('BucketItem with ID: ' + delID + ' deleted!');
  }
});

//cycles through the array to find the array element with a matching ID
function GetArrayPointer(localID) {
  for (let i = 0; i < serverArray.length; i++) {
    if (localID === serverArray[i].ID) {
      return i;
    }
  }
  return -1; //flag to say did not find bucket list item
};

module.exports = router;
