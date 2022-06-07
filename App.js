
import 'react-native-gesture-handler';
import React,{useState,useEffect} from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView,StyleSheet,PixelRatio,useWindowDimensions,Dimensions,ScrollView,ImageBackground, View,Text,StatusBar,Image,TouchableOpacity} from 'react-native';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import Svg, {Line,Rect} from 'react-native-svg';


class FotoAyari{
	constructor()
	{
		this.mediaType="photo";
		this.includeBase64=false;
	}
}

class Resim{

}


const  Stil=StyleSheet.create({

  SecimEkraniView:{
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#befc03",
    flex:1,
  },

  SecimEkraniButon:{
    width:300,
    height:100,
    backgroundColor:"#fcf403",
    justifyContent:"center",
    alignItems:"center",
    borderColor:"black",
    borderWidth:2,
    margin:10,
  },

  SecimEkraniText:{
    color:"red",
    fontSize:20,
    margin:10,
  },

  OnayEkraniView:{
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fcf403",
    flex:1,
  },

  OnayEkraniResim:{
  	width:"100%",
	height:"80%",
  	borderColor:"orange",
    borderWidth:2,
  },

  OnayEkraniButon:{
  	width:300,
    height:100,
    backgroundColor:"#befc03",
    justifyContent:"center",
    alignItems:"center",
    borderColor:"black",
    borderWidth:2,
    margin:10,
  },

  SonucSecimEkraniView:{
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#befc03",
    flex:1,
  },

 	SonucSecimEkraniButon:{
    width:300,
    height:100,
    backgroundColor:"#fcf403",
    justifyContent:"center",
    alignItems:"center",
    borderColor:"black",
    borderWidth:2,
    margin:40,
  },

  SonucEkraniCizgi:{
  	position:"absolute",
  },

  SonucYazdirmaEkraniView:{
  	justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#befc03",
  },

  SonucYazdirmaEkraniMiniView:{
  	justifyContent:"center",
    alignItems:"center",
    backgroundColor:"orange",
    borderColor:"black",
    borderWidth:2,
    margin:30,
    flexDirection:"row",
  },

  SonucYazdirmaEkraniText:
  {
  	color:"blue",
    fontSize:10,
    margin:20,
  }




})




const Stack = createStackNavigator();

let fotoAyari=new FotoAyari();

let kontrol;

let secilenResim=new Resim();

const referans = storage().ref("Resimler/yeniResim");

let cevap,cevapJson;
let nesneler=[];



//https://blog.jscrambler.com/create-a-react-native-image-recognition-app-with-google-vision-api/
submitToGoogle = async () => {

     let body = JSON.stringify({
       requests: [
         {
           features: [
             { type: "OBJECT_LOCALIZATION", maxResults: 10 },
           ],
           image: {
             "source":{
          "imageUri":
            "gs://yazlab3-d1312.appspot.com/Resimler/yeniResim_640x480"
        }
           }
         }
       ]
     });
      cevap = await fetch(
       "https://vision.googleapis.com/v1/images:API_KEY",
       {
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json"
         },
         method: "POST",
         body: body
       }
     );
      cevapJson = await cevap.json();
   	  nesneler=cevapJson.responses[0].localizedObjectAnnotations;

   	  if(nesneler==null)
   	  {
   	  	kontrol=false;

   	  }

   	  else
   	  {
   	  	kontrol=true;
   	  }
 }




const SecimEkrani=({navigation}) =>
{	


	function resimCek()
	{
		fotoAyari.saveToPhotos=true;
		
		launchCamera(fotoAyari,(resim)=>
		{
			secilenResim=resim;
			navigation.navigate("OnayEkrani");
		});		

	}

	function resimSecimi()
	{
		launchImageLibrary(fotoAyari,(resim)=>
		{
			secilenResim=resim;
			navigation.navigate("OnayEkrani");
		});
	}
	
  return(

    <View style={Stil.SecimEkraniView} >
    <Image source={require("./Resimler/SecimEkraniResim.png")}/>
    <TouchableOpacity onPress={()=>{resimCek();}} style={Stil.SecimEkraniButon}><Text>Fotoğraf Çekimi</Text></TouchableOpacity>
    <TouchableOpacity onPress={()=>{resimSecimi();}} style={Stil.SecimEkraniButon}><Text>Galeriye Git</Text></TouchableOpacity>
    <Text style={Stil.SecimEkraniText} >Hüseyin Kurt</Text>
    <Text style={Stil.SecimEkraniText} >180201021</Text>
    </View>


    );
}

//https://www.sitepoint.com/delay-sleep-pause-wait/#:~:text=The%20standard%20way%20of%20creating,()%20%3D%3E%20%7B%20console.
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}



const OnayEkrani=({navigation}) =>
{	

		function onayla()
		{
			let soz=referans.putFile(secilenResim.uri);

			soz.then(()=>{

				sleep(2000);

				let soz2=submitToGoogle();

				soz2.then(()=>{

					
					if(kontrol)
					{
						navigation.navigate("SonucSecimEkrani");
					}

					else
					{
						alert("Nesne Bulunamadı!");
					}

				})
			})
		}
		


	return(

		<View Style={Stil.OnayEkraniView} >
		<Image style={Stil.OnayEkraniResim} source={{uri:secilenResim.uri}}/>
		<TouchableOpacity onPress={() =>{onayla();}} style={Stil.OnayEkraniButon} ><Text>Onayla</Text></TouchableOpacity>
		</View>
		);
}


const SonucSecimEkrani=({navigation}) =>
{


	return(

		<View style={Stil.SonucSecimEkraniView} >
		<TouchableOpacity onPress={() =>{navigation.navigate("SonucYazdirmaEkrani");}} style={Stil.SonucSecimEkraniButon} ><Text>Nesne Bilgilerini Oku</Text></TouchableOpacity>
    	<TouchableOpacity onPress={()=> {navigation.navigate("SonucEkrani");}} style={Stil.SonucSecimEkraniButon} ><Text>İşlenmiş Görüntüyü İncele</Text></TouchableOpacity>
		</View>

		);

}

const SonucYazdirmaEkrani=({navigation}) =>
{
	return(

		<ScrollView contentContainerStyle={Stil.SonucYazdirmaEkraniView} >
		{
			nesneler.map((nesne) => 
			{	
				return(
					<View style={Stil.SonucYazdirmaEkraniMiniView} >
					<View>
					<Text style={Stil.SonucYazdirmaEkraniText} > Nesne Adı:{nesne.name}</Text>
					<Text style={Stil.SonucYazdirmaEkraniText} > Güvenilirlik:{nesne.score}</Text>
					</View>
					<View>
					<Text style={Stil.SonucYazdirmaEkraniText} > x0:{nesne.boundingPoly.normalizedVertices[0].x}</Text>
					<Text style={Stil.SonucYazdirmaEkraniText} > y0:{nesne.boundingPoly.normalizedVertices[0].y}</Text>
					</View>
					</View>
					);
			})
		}

		</ScrollView>

		);
}


const SonucEkrani=({navigation}) =>
{




	return(

		<View style={{flex: 1}} >
		<ImageBackground style={{flex: 1,justifyContent: "center"}} resizeMode="stretch" source={{uri:secilenResim.uri}}>
		{
			nesneler.map((nesne,nesneId) =>{
				console.log(nesne.boundingPoly.normalizedVertices)
				let x0=(nesne.boundingPoly.normalizedVertices[0].x);
				let x1=(nesne.boundingPoly.normalizedVertices[1].x);
				let x2=(nesne.boundingPoly.normalizedVertices[2].x);
				let x3=(nesne.boundingPoly.normalizedVertices[3].x);

				let y0=(nesne.boundingPoly.normalizedVertices[0].y);
				let y1=(nesne.boundingPoly.normalizedVertices[1].y);
				let y2=(nesne.boundingPoly.normalizedVertices[2].y);
				let y3=(nesne.boundingPoly.normalizedVertices[3].y);





				let genislik=(x1-x0)*Dimensions.get('window').width;
				let uzunluk=(y2-y1)*Dimensions.get('window').height;

				let baslangicx=x0*Dimensions.get('window').width;
				let baslangicy=y0*Dimensions.get('window').height;



				return(
					
					<View style={Stil.SonucEkraniCizgi} >
					<Svg width={useWindowDimensions().width} height={useWindowDimensions().height}>
  					<Rect
    				x={baslangicx}
    				y={baslangicy}
    				width={genislik}
    				height={uzunluk}
    				strokeWidth="2"
    				stroke="green"/>
					</Svg>
					</View>
					);

			})
		}
		</ImageBackground>
		</View>

		);
}






const Uygulama=() =>{
  return(
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="SecimEkrani" component={SecimEkrani} options={{title:"Hoş Geldiniz!",headerStyle:{backgroundColor:"orange"},headerTintColor:"white"}} />
    <Stack.Screen name="SonucSecimEkrani" component={SonucSecimEkrani} options={{title:"Tercih Yapın?",headerStyle:{backgroundColor:"orange"},headerTintColor:"white"}} />
    <Stack.Screen name="OnayEkrani" component={OnayEkrani} options={{title:"Seçiminizi Onaylayın",headerStyle:{backgroundColor:"red"},headerTintColor:"white"}} />
    <Stack.Screen name="SonucEkrani" component={SonucEkrani} options={{title:"Belirlenen Nesneler",headerStyle:{backgroundColor:"red"},headerTintColor:"white"}} />
    <Stack.Screen name="SonucYazdirmaEkrani" component={SonucYazdirmaEkrani} options={{title:"Belirlenen Nesneler",headerStyle:{backgroundColor:"red"},headerTintColor:"white"}} />
    </Stack.Navigator>
    </NavigationContainer>
    );
}

export default Uygulama;
