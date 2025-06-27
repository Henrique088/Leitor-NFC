import styled from "styled-components"; 


export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backgroundColor};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Title = styled.Text`
  margin-bottom: 5px;
  font-size: 25px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;

export const Button = styled.TouchableOpacity`
  width: 80%;
  padding: 15px;
  border-radius: 10px;
  background-color: #0fd850;
  align-items: center;
  margin-vertical: 10px;
  shadow-color: #000;

`;

export const ButtonText = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;
export const Input = styled.TextInput`
  width: 80%;
  padding: 10px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #d91111;
`;


export const Safe = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.backgroundColor};
  justify-content: center;
  align-items: center;
`;


export const Texto = styled.TextInput`
width: 80%;
  padding: 10px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  color: ${props => props.theme.text};
  margin-bottom: 15px;
`;



// input: {
//     width: '80%',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     color: '#FFFFFF',
//   }
// });