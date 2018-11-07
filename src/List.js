import React from 'react';
function ListItem(props){
    return(
        <tr><td key={props.item.Key}>{props.item.ItemText}</td><td><button onClick={props.onClick}>Delete</button></td></tr>
    );
}
  class List extends React.Component {

      constructor(props) {
          super(props);
          this.state = {
              name:null,
              key:null,
              items:[],
              newItem:``,
          };
          this.newText = React.createRef();
          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
          this.handleDelete = this.handleDelete.bind(this);
          this.renderListItem = this.renderListItem.bind(this);
          this.clearState = this.clearState.bind(this);
      }
      handleChange(event) {
          this.setState({newItem:event.target.value});
      }
      handleSubmit(event) {
        let ths = this;
          event.preventDefault();
          fetch(this.props.url + "/add/" + this.state.key, {
            method:"POST",
            mode:'cors',
            Headers: {
                "Content-Type":"application/json",
            },
            body:JSON.stringify({Text:this.state.newItem}),
          }).then(response => {return response.json()}).then(function(json) {
              if (json.Success) {
                const itms = ths.state.items.slice();
                let newItm = {Key:json.Item.Key,ItemText:ths.state.newItem}
                itms.push(newItm);
                ths.setState({items:itms,newItem:'',});
                console.log(itms);
              }
              ths.clearState();
          });
      }
      clearState() {
        this.newText.current.value = '';
      }
      handleDelete(k) {
          fetch(this.props.url + "/delete",{
              method:"POST",
              mode:"cors",
              Headers: {
                  "Content-Type":"application/json",
              },
              body:JSON.stringify({Text:k}),
          }).then((resp)=> {
            return resp.json();
          }).then((json) => {
              if(json.Success) {
                  console.log("success!");
                  const itms = this.state.items.slice();
                  console.log(itms);
                  const newItms = itms.filter(item => {
                      if(item.Key !== k) {
                          
                          return true;
                      } else {
                        console.log(item.Key);
                          return false;
                      }
                });
                  console.log(itms);
                  this.setState({items:newItms});
              } else {
                  console.log(json.ErrorText);
              }
          });
      }
      renderListItem(it) {
          return(
              <ListItem item={it} onClick={() => this.handleDelete(it.Key)}/>
          );
      }
      componentDidMount() {
          fetch(this.props.url)
          .then(function(response) {
              if (response.ok) {
              return response.json();
              } else {
                  console.log("error getting json. responose not ok")
              }
          }).then(body => {
              console.log(JSON.stringify(body));
            this.setState({name:body.Lst.name,key:body.Lst.key,items:body.Lst.items})});
      }
      render() {
          let ths = this
        let listitems = this.state.items.map(function(item) {
       return ths.renderListItem(item);
    });
          return(
              <div>
             <table><tbody>{listitems}</tbody></table>
             <form name="NewText" onSubmit={this.handleSubmit}>
             <input type="text" ref={this.newText} onChange={this.handleChange}/>
             <button type="submit">Submit</button>
             </form>
             </div>
          );
      }
  }
  export default List;