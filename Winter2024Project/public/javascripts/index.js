const { application } = require("express");

let bucketListArray = [];

let BucketListObject = function (pName) {
    this.Name = pName;
}

// BucketListArray.push(new BucketListObject("test", 1));
// BucketListArray.push(new BucketListObject("test1", 2));
// BucketListArray.push(new BucketListObject("test2", 3));

let selectedGenre = 'not selected';

document.addEventListener("DOMContentLoaded", function () {
    createList();


    //add button events **********************************************************************************
    document.getElementById("buttonAdd").addEventListener("click", function () {

        //bucketListArray.push(new BucketListObject(document.getElementById("name").value));
        let newBucketListItem =new BucketListObject(document.getElementById("name").value);

        //send new bucket list item to server
        $.ajax({
            url: "/AddBucketListItem",
            type: "POST",
            data: JSON.stringify(newBucketListItem),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result){
                console.log(result);
                document.location.href = "index.html#ListAll";
            }
        });

    });

    document.getElementById("buttonDelete").addEventListener("click", function () {
        document.getElementById("name") = "";
        let localParm = localStorage.getItem('parm');
        deleteBucketListItem(localParm);
    });
    ///////////

    document.getElementById("buttonSortName").addEventListener("click", function () {
        bucketListArray.sort(dynamicSort("Name"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    // document.getElementById("trailer").addEventListener("click", function () {
    //         window.open(document.getElementById("oneURL").innerHTML);
    // });
});
//end button events **************************************************************************************

//page before show code ********************************************************************************
$(document).on("pagebeforeshow", "#ListAll", function (event) {
    createList();
});

//fill in details page based on info passed in ID
$(document).on("pagebeforeshow", "#details", function (event) {
    let localID = localStorage.getItem('parm');
    bucketListArray = JSON.parse(localStorage.getItem('bucketListArray'));
    let pointer = GetObjectPointer(localID);
});
//page before show code ********************************************************************************

function createList() {
    $.get("/getAllBucketListItems", function (data, status) {
        console.log(status);
        bucketListArray = data;

        //clear prior data
        let myUL = document.getElementById("BucketListUL");
        myUL.innerHTML = "";


        bucketListArray.forEach(function (oneBucketListItem,) {
                var myLi = document.createElement('li');
                myLi.classList.add('oneBucketListItem');
                myLi.setAttribute("data-parm", oneBucketListItem.ID);
                myLi.innerHTML = oneBucketListItem.ID + ": " + oneBucketListItem.Name;
                myUL.appendChild(myLi);
        });

        var liList = document.getElementsByClassName("oneBucketListItem");
        let newBucketListArray = Array.from(liList);
        newBucketListArray.forEach(function (element){
            element.addEventListener('click', function () {
                var parm = this.getAttribute("data-parm");
                localStorage.setItem('parm', parm);

                let stringBucketListArray = JSON.stringify(bucketListArray);
                localStorage.setItem('bucketListArray', stringBucketListArray);

                document.location.href ="index.html#details";
            });
        });
    });
};

//remove a bucket list item from array
function deleteBucketListItem(which){
    console.log(which);

    //tell server to remove it from the server array
    $.ajax({
        type: "DELETE",
        url: "/DeleteBucketListItem/" + which,
        success: function(result){
            console.log(result + " back from delete on server");
            document.location.href = "index.html#ListAll"; //go back to bucket list

        },
        error: function(xhr, textStatus, errorThrown){
            console.log(textStatus);
            alert("server failed to delete");
        }
    })
}