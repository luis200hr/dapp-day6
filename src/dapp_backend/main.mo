import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Array "mo:base/Array";
import List "mo:base/List";

import Type "Types";

actor class HomeDiary() {
  type Homework = Type.Homework;
  var homeworkDiary : Buffer.Buffer<Homework> = Buffer.Buffer<Homework>(0);
  var Id : Nat = 0;

  // Add a new homework task
  public shared func addHomework(homework : Homework) : async Nat {
    homeworkDiary.add(homework);
    Id := homeworkDiary.size();
    return Id-1;
  };

  //Optener una tarea especifica por ID
  public shared query func getHomework(id : Nat) : async Result.Result<Homework, Text> {
    if(id < homeworkDiary.size() and id >= 0){
      #ok(homeworkDiary.get(id));
    } else {
      #err("homework not found");
    }
  };

  // Update a homework task's title, description, and/or due date
  public shared func updateHomework(id : Nat, homework : Homework) : async Result.Result<(), Text> {
    if(id < homeworkDiary.size() and id >= 0){
      homeworkDiary.put(id, homework);
      #ok();
    } else {
      #err("homework not found");
    }
  };

  // Mark a homework task as completed
  public shared func markAsCompleted(id : Nat) : async Result.Result<(), Text> {
    if(id < homeworkDiary.size() and id >= 0){
      var homework : Homework = homeworkDiary.get(id);
      let update : Homework = {
        title = homework.title;
      description = homework.description;
      dueDate = homework.dueDate;
      completed = true;
      };
      homeworkDiary.put(id, update);
      #ok();
    } else {
      #err("homework not found");
    }
  };

  // Delete a homework task by id
  public shared func deleteHomework(id : Nat) : async Result.Result<(), Text> {
    if(id <= homeworkDiary.size() and id >= 0){
      let x = homeworkDiary.remove(id);
      #ok();   
    } else {
      #err("homework not found"); 
    }
  };

  // Get the list of all homework tasks
  public shared query func getAllHomework() : async [Homework] {
    return (Buffer.toArray(homeworkDiary));       
  };

  // Get the list of pending (not completed) homework tasks
  public shared query func getPendingHomework() : async [Homework] {
    let homeworks = Buffer.toArray(homeworkDiary);
    var pending = Buffer.Buffer<Homework>(0);
    for(homework in homeworks.vals()) {
        if(homework.completed == false){
                pending.add(homework);
        }
    };

    return Buffer.toArray(pending);
  };

  // Search for homework tasks based on a search terms
  public shared query func searchHomework(searchTerm : Text) : async [Homework] {
    let homeworks = Buffer.toArray(homeworkDiary);
    var result = Buffer.Buffer<Homework>(0);
      for(homework in homeworks.vals()) {
            if(searchTerm == homework.title or searchTerm == homework.description){
                result.add(homework);
            }
        };
        return Buffer.toArray(result);
  };
};