import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Array "mo:base/Array";

module Homework{
  public type Time = Time.Time;
  public type Homework = {
    title : Text;
    description : Text;
    dueDate : Text;
    completed : Bool;
  };

   //funcion para crear un nueva tarea, basado en los paramentros 
  public func create_homework(t : Text ,d : Text, dt : Text, b : Bool) : async Homework {
    let homework : Homework = {
      title= t;
      description= d;
      dueDate= dt;
      completed= b;
    };
    return homework;
  };
};