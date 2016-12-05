import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import { Container, Header, Content, Title,Button, Icon,Card, CardItem, Thumbnail } from 'native-base';
import ViewContainer from '../components/ViewContainer/ViewContainer'
import StatusBarBackground from '../components/StatusBarBackground/StatusBarBackground'
import FitImage from 'react-native-fit-image';
import styles from '../styles/appStyles'
import _ from 'lodash'
//import Icon from 'react-native-vector-icons/FontAwesome'

export default class Entity extends Component {
  constructor(props) {
    super (props)
    // this._navigateToThisEvent = this._navigateToThisEvent.bind(this)

    this.state = {
      bookdetail: this.props.element,
      interested:0
    }
   this.handleShowInterest = this.handleShowInterest.bind(this);
  }


handleShowInterest(book,user){
  this.setState({
    interested: 1,
  });
console.log("user "+user+" shown interest in book "+ book.title );

 fetch('https://module4server.herokuapp.com/showinterest', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       userName: user,
       postId: book.postId
     })
   })
   .then( (response) => response.json() )
   .then((responseJson) => {
         interestflag = responseJson.flag;
         console.log(user + "shown interest to buy "+ book.postId + "with flag "+interestflag);
       if (interestflag==1) {
           console.log('show interest success ', user)

             } else {
                 Alert.alert("show interest operation failed")
             }
       });

}

	render() {
		return (
      <Container>
                <Content>
                <Header>


                    <Button transparent onPress={ () => this.props.navigator.pop() }>
                        <Icon name='ios-arrow-back' />
                      </Button>
                    <Title>Book Details</Title>


                </Header>
                        <View style={{ flex: 1 }}>

                              <Text> {this.props.element.title } </Text>
                              <Text> Publisher: {this.props.element.publisher } </Text>
                              <Text> ISBN: {this.props.element.isbn } </Text>
                              <Text> current user/buyer : { this.props.name} </Text>
                            <Image source={{uri: this.props.element.imageLinks.thumbnail}} style={{margin:20, alignSelf:'center',width:200,height:200}} />
                            <Text></Text>

                             <Text>Price: ${this.props.element.askingPrice}</Text>
                              <Text></Text>
                               <Text>Description</Text>
                            <Text style={{borderWidth :2}}>
                             {this.props.element.description}
                            </Text>
                            <Text></Text>
                          { ((this.props.element.interestedUsers.indexOf(this.props.name)==-1) && this.state.interested == 0 ) ?
                            <Button rounded style={{alignSelf:'center'} } onPress={() => this.handleShowInterest(this.props.element,this.props.name)} >

                              Interested to Buy
                            </Button>
                            :
                            <Button disabled style={{alignSelf:'center'} }  >

                              Already Shown Interest!
                            </Button>
                           }



 </View>
                </Content>
            </Container>


			)
	}
}
