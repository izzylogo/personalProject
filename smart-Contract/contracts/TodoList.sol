//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint256 NumOfTodo; // setting the number of todo thar has been in the transaction
    //todo events
    event Todo(string keyword, string detail, uint256 timestamp);
    //todo structs
    struct TodoStruct {
        string keyword;
        string detail;
        uint256 timestamp;
    }
    // Creating an array of Todostructs
    TodoStruct[] todos;
    // Adding the todos to the blockchain
    function addTodo(string memory keyword, string memory detail) public {
        NumOfTodo += 1;
        todos.push(TodoStruct(keyword, detail, block.timestamp));

        emit Todo(keyword, detail, block.timestamp);
    }

    // Getting all the todos that has been transacted
    function getAllTodos() public view returns (TodoStruct[] memory) {
        return todos;
    }

    // Getting the number of all the todos in the transaction
    function getTodoNum() public view returns (uint256) {
        return NumOfTodo;
    }

}