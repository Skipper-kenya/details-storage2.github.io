let details_list=document.querySelector('.list-container');
let form=document.querySelector('#myForm');
let input_field=document.querySelector('#inputField');

let fieldset_container=document.querySelector('.field2');


/**Grabbing the alert container */
let output_alert=document.querySelector('.alert-container');
let clear_items=document.querySelector('.clear-details');
let submitBtn=document.querySelector('.submitBtn');

let editFlag=false;
let editElement;
let editId="";

form.addEventListener('submit', update_regist_details);

function update_regist_details(e){
    e.preventDefault();

    let id=new Date().getTime().toString();
    let input_value=input_field.value;
    
    let registration_regex=/(bit)[\/\-\.][\d]{3}[\/\-\.](0?21)$/gi
    let test_regex=registration_regex.test(input_value);

    if(input_value !=="" && !editFlag && test_regex){
        let element=document.createElement('article');
        element.classList.add('individual-element');

        let createAttribute=document.createAttribute('data-id');
        createAttribute.value=id;

        element.setAttributeNode(createAttribute);

        element.innerHTML=`
           <p>${input_value}</p>
           <div class="btns-holder">
               <button class="edit-btn">Edit</button>
               <button  class="delete-btn">Delete</button>
           </div>
        `;

        clear_items.addEventListener('click',clearAll_details)

        let edit_btn=element.querySelector('.edit-btn');
        let delete_btn=element.querySelector('.delete-btn');

        edit_btn.addEventListener('click',editDetails);
        delete_btn.addEventListener('click',deleteDetails)

        details_list.appendChild(element)
        fieldset_container.classList.add('show-field2');
      
        clear_items.classList.add('show-clear_details')
        alertDisplay('Registration number added','success');
       
        settingBack_Defaults();
        setting_up_localstorage(id,input_value);
        

    }else if(input_value !=="" && !editFlag && !test_regex){
           showError(input_field,"invalid Registration number")
    }else if(input_value !=="" &&  editFlag && !test_regex){
        showError(input_field,"invalid Registration number")
    }
    else if(input_value !=="" &&  editFlag && test_regex){
           editElement.innerHTML=input_value
           alertDisplay('Registration Value changed','success')
           edit_local_storage(editId,input_value);
           settingBack_Defaults();
         
    }
    else{
        alertDisplay('Registration No. Required','danger')
    }

}


function alertDisplay(message,action){
    output_alert.innerHTML=message;
    output_alert.classList.add(`alert-${action}`);

    let alertTimeout=setTimeout(()=>{
        output_alert.innerHTML="";
        output_alert.classList.remove(`alert-${action}`);
    },2000)
}

function settingBack_Defaults(){
    input_field.value="";
    submitBtn.innerHTML="Submit";
    editFlag=false;
    editId="";
}


function showError(input, message){
    let inputContainer=input.parentElement;
    inputContainer.classList.add('error')
    let small=inputContainer.querySelector('small');
    small.innerHTML=message;


    let remove_show_error=setTimeout(()=>{
        let inputContainer=input.parentElement;
        inputContainer.classList.remove('error')
        let small=inputContainer.querySelector('small');
        small.innerHTML="";
    },2000)
}


function deleteDetails(e){
    let curr=e.currentTarget.parentElement.parentElement;

    details_list.removeChild(curr)

    alertDisplay('Registration No. removed',"danger")

    if(details_list.children.length === 0){
        clear_items.classList.remove('show-clear_details');
        fieldset_container.classList.remove('show-field2');
    }

    let element=e.currentTarget.parentElement.parentElement;
    let id=element.dataset.id;

    delete_local_storage(id)
}

function editDetails(e){
    
    editFlag=true
    editElement=e.currentTarget.parentElement.previousElementSibling;

    submitBtn.innerHTML="Edit"
    

    input_field.value=editElement.innerHTML;

    let element=e.currentTarget.parentElement.parentElement;
    let id=element.dataset.id;

    editId=id;
}

function clearAll_details(){
   
    let individul_elements=document.querySelectorAll('.individual-element');

    individul_elements.forEach((individual)=>{
        details_list.removeChild(individual);

        if(details_list.children.length === 0){
            clear_items.classList.remove('show-clear_details')
            fieldset_container.classList.remove('show-field2');
        }
    })

    localStorage.removeItem('list');
    
}


/**CREATING A LOCAL STORAGE FOR THE REGISTRATION NUMBERS UPLOADED BY USERS */


function setting_up_localstorage(id,value){
    let ind_items={id,value};
    let items=get_local_storage();

    items.push(ind_items);

    localStorage.setItem('list',JSON.stringify(items))
}

function get_local_storage(){
    return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list')):
    [];
}


function edit_local_storage(id,input_value){
    let items=get_local_storage();
  
    items=items.map((item)=>{
        if(item.id === id){
            item.value=input_value
        }
        return item
    })

    localStorage.setItem('list',JSON.stringify(items))
}


function delete_local_storage(id){
    let items=get_local_storage();

    items=items.filter((item)=>{
        if(item.id !== id){
            return item
        }
    })

    localStorage.setItem('list',JSON.stringify(items))
}


/**SETTING UP THE BACKUP TO OUR ACTUAL SITE (FROM OUR LOCAL STORAGE)*/

window.addEventListener('DOMContentLoaded',setup_items);

function setup_items(){
    let items=get_local_storage();
    items.forEach((item)=>{
        mapping_items(item.id,item.value);
    })
}

function mapping_items(id,input_value){
    let element=document.createElement('article');
    element.classList.add('individual-element');

    let createAttribute=document.createAttribute('data-id');
    createAttribute.value=id;

    element.setAttributeNode(createAttribute);

    element.innerHTML=`
       <p>${input_value}</p>
       <div class="btns-holder">
           <button class="edit-btn">Edit</button>
           <button  class="delete-btn">Delete</button>
       </div>
    `;

    clear_items.addEventListener('click',clearAll_details)

    let edit_btn=element.querySelector('.edit-btn');
    let delete_btn=element.querySelector('.delete-btn');

    edit_btn.addEventListener('click',editDetails);
    delete_btn.addEventListener('click',deleteDetails)

    details_list.appendChild(element);
    fieldset_container.classList.add('show-field2');
    clear_items.classList.add('show-clear_details')
        alertDisplay('Registration number added','success');
}