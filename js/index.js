import '../less/index.less';
document.querySelector('.tabIndex').style.color="red";

function testable(target) {
    target.isTestable = true;
  }
  
  @testable
  class MyTestableClass {
    // ...
  }
  
  console.log(MyTestableClass.isTestable)// true
  console.log('22wdaa')