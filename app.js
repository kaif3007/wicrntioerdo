
let skip=0;

let data=[];

//for get, put, post request
class EasyHTTP
 {
         async get(url)
         {
            const response=await fetch(url);
            return await response.json();
         }
 
         async post(url,data)
         {
             const response=await fetch(url,{
                      method: 'POST',
                      headers: {
                          'Content-type': 'application/json'
                      },
                      body: JSON.stringify(data)
                  });
 
             return  await response.json();  
        }

        async put(url,data)
        {
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
              });

              return  await response.json();   
        }
}

 function clearAlert()
 {
     const alert=document.querySelector('.alert');

     if(alert)
      alert.remove();
 }

 function showAlert(message,className)
 {
     clearAlert();

     const div=document.createElement('div');
     div.className=className;
     div.appendChild(document.createTextNode(message));

     const container=document.querySelector('.body-container');
     const search=document.querySelector('.main-body');

     container.insertBefore(div,search);

     setTimeout(()=>this.clearAlert(),3000);
 }

document.getElementById('details').addEventListener('keyup',e=>{
        const name=document.getElementById('owner').value;
        const caption=document.getElementById('caption').value;
        const url=document.getElementById('url').value;

        if(name!=='' && caption!=='' && url!=='')
        {
            document.querySelector('.submit').removeAttribute('disabled')

            const data={
                name: name,
                caption: caption,
                url: url
            }

            
            document.querySelector('.submit').addEventListener('click',(e)=>{
                e.preventDefault()
                document.getElementById('owner').value='';
                document.getElementById('caption').value='';
                document.getElementById('url').value='';

                document.querySelector('.submit').setAttribute('disabled',null)

                if(document.querySelector('.progress')===null)
                    postFormData(data)
            });
        }
        else
        {
            document.querySelector('.submit').setAttribute('disabled',null)
        }

        e.preventDefault();
});

document.querySelector('#item-list').addEventListener('click',e=>{
     
    if(e.target.className.includes('fa'))
    {

         let arr=e.target.className.split(' ')
         const id=parseInt(arr[arr.length-1])

         let caption=null;
         let url=null;
         data.forEach(t=>{
             if(t[0]===id)
             {
                 caption=t[1];
                 url=t[2];
             }
         })

         document.getElementById("overlay").style.display = "block";
         document.getElementById("edit-caption").value=caption;
         document.getElementById("edit-url").value=url;

         document.querySelector('.edit-back').addEventListener('click',(e)=>{
            document.getElementById("overlay").style.display = "none";
         })

         document.querySelector('.edit-submit').addEventListener('click',(e)=>{
             
             e.preventDefault()
             caption=document.getElementById("edit-caption").value;
             url=document.getElementById("edit-url").value;

            document.getElementById("overlay").style.display = "none";
            const div=document.createElement('div');
            div.className='progress blue';

            const divChild=document.createElement('div');
            divChild.className='indeterminate';
            div.appendChild(divChild);

            const container=document.querySelector('.body-container');
            const search=document.querySelector('.main-body');

            container.insertBefore(div,search);

             patchMeme(id,caption,url)
            
         });   
    }
});

function patchMeme(id,caption,url)
{
    const http=new EasyHTTP

    const data={
        caption:caption,
        url:url
    }

    http.put(`https://xmeme-backend.herokuapp.com/memes/${id}`,data)
    .then( res=>{
     getMeme(0)
     document.querySelector('.progress').remove()
     showAlert('Meme was updated successfully','card blue alert')
   })
    .catch(err=>{
        document.querySelector('.progress').remove()
        showAlert('There was an error in updating your meme','card red alert')
    });
}



document.querySelector('.get').addEventListener('click',e=>{
    e.preventDefault()
    getMeme(1)}
    );


function getMeme(param)
{
        const http=new EasyHTTP;

        let output='<div class="progress blue"> <div class="indeterminate"></div></div>'

        let url=`https://xmeme-backend.herokuapp.com/memes?skip=${skip}&take=5`
        if(param===0)
          url=`https://xmeme-backend.herokuapp.com/memes?skip=${skip-5}&take=5`


        http.get(url)
                    .then( res=>{
                        
                       let temp=[]
                        res.forEach( r=> {
                        temp.push(`<li class="collection-item"> 
                            <div class="row">
                            <div class="col s12 m6">
                            <div class="card">
                                <div class="card-image">
                                <img src=${r.url}>
                                <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="fa fa-pencil ${r.id}"></i></a>
                                </div>
                                <div class="card-title center">
                                <h4>${r.name}</h4>
                                </div>
                                <div class="card-content">
                                <p>${r.caption}</p>
                                </div>
                            </div>
                            </div>
                        </div>

                            </li>`)

                            data.push([r.id,r.caption,r.url])

                        })


                        
                        if(temp.length>0)
                        {   
                            let ans=''
                            temp.forEach(
                                p=>{
                                    ans+=p
                                })

                                document.querySelector('#item-list').innerHTML=ans;   
                                skip+=temp.length      
                                   
                        }
                        else
                        {
                            window.location.reload()
                        }
                      
                        document.querySelector('.get').childNodes[0].nodeValue='Next'
                     
                        
                    })
                    .catch(err=>{
                        
                        showAlert('There was an error in loading memes','card red alert')

                    });

                    document.querySelector('#item-list').innerHTML=output;
}

function postFormData(data)
{
        const http=new EasyHTTP;

        const div=document.createElement('div');
        div.className='progress blue';

        const divChild=document.createElement('div');
        divChild.className='indeterminate';
        div.appendChild(divChild);

        const container=document.querySelector('.body-container');
        const search=document.querySelector('.main-body');

        container.insertBefore(div,search);


        http.post(`https://xmeme-backend.herokuapp.com/memes?name=${data.name}&caption=${data.caption}&url=${data.url}`)
                 .then( res=>{
                
                 document.querySelector('.progress').remove()
                 showAlert('Your meme was posted successfully','card blue alert')
                
                })
                 .catch(err=>{

                    document.querySelector('.progress').remove()
                    showAlert('There was an error in posting your meme','card red alert')

                 });
}
