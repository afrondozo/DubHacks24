import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const FoodShelfLifeTracker = ({ navigation }) => {
  const [foods, setFoods] = useState([
    { id: 1, name: 'A5 Wagyu', quantity: 2, expiresIn: 5 },
    { id: 2, name: 'Yogurt', quantity: 3, expiresIn: 2 },
    { id: 3, name: 'Milk', quantity: 1, expiresIn: 7 },
    { id: 4, name: 'Bananas', quantity: 1, expiresIn: 1 },
    { id: 5, name: 'Ice Cream', quantity: 1, expiresIn: 30 },
    { id: 6, name: 'Rice', quantity: 1, expiresIn: 0 },
  ]);

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [title, setTitle] = useState("Food Shelf Life Tracker");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleAddFood = (newFood) => {
    setFoods((prevFoods) => [...prevFoods, newFood]);
  };

  const toggleRemoveMode = () => {
    setIsRemoveMode(!isRemoveMode);
    setSelectedFood(null);
  };

  const handleFoodPress = (food) => {
    if (isRemoveMode) {
      setSelectedFood(food);
    } else if (selectedFood && selectedFood.id === food.id) {
      setSelectedFood(null);
    } else {
      setSelectedFood(food);
    }
  };

  const handleConfirmRemove = () => {
    if (selectedFoods.length > 0) {
      setFoods((prevFoods) => prevFoods.filter(item => !selectedFoods.includes(item)));
      setSelectedFoods([]); // Clear selected foods after removal
      setIsRemoveMode(false); // Exit remove mode after deletion
    }
  };

  const handleBackgroundPress = () => {
    if (!isRemoveMode) {
      setSelectedFood(null);
    }
    setIsEditingTitle(false);
  };

  const getBackgroundColor = (expiresIn) => {
    if (expiresIn <= 1) return '#ffcccb'; // Light red
    if (expiresIn <= 3) return '#ffd700'; // Yellow-orange
    return '#90ee90'; // Light green
  };

  const handleTitlePress = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <SafeAreaView style={styles.container}>
        {isEditingTitle ? (
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={handleTitlePress}>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        )}
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {foods.map((food) => (
            <TouchableOpacity
              key={food.id}
              style={[
                styles.foodItem,
                { backgroundColor: getBackgroundColor(food.expiresIn) },
                selectedFood && selectedFood.id === food.id ? styles.selectedFood : null,
                isRemoveMode && styles.removeMode
              ]}
              onPress={() => handleFoodPress(food)}
            >
              {food.quantity > 1 && (
                <View style={styles.quantityCircle}>
                  <Text style={styles.quantityText}>{food.quantity}x</Text>
                </View>
              )}
              <Text style={styles.foodName}>{food.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {selectedFood && !isRemoveMode ? (
          <View style={styles.detailView}>
            <Text style={styles.detailText}>
              {selectedFood.expiresIn === 0
                ? `${selectedFood.name} is expired!!! Throw away`
                : `${selectedFood.name} expires in ${selectedFood.expiresIn} days!!!`}
            </Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, isRemoveMode ? styles.confirmButton : styles.addButton]} 
              onPress={isRemoveMode ? handleConfirmRemove : () => navigation.navigate('AddFood', { onAddFood: handleAddFood })}
              disabled={isRemoveMode && !selectedFood}
            >
              <Text style={styles.buttonText}>{isRemoveMode ? 'Confirm Remove' : 'Add Food'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.removeButton, isRemoveMode && styles.activeRemoveButton]}
              onPress={toggleRemoveMode}
            >
              <Text style={styles.buttonText}>{isRemoveMode ? 'Cancel' : 'Remove'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {isRemoveMode && (
          <Text style={styles.removeInstructions}>
            {selectedFood ? 'Tap Confirm Remove to delete the selected item' : 'Tap on a food item to select for removal'}
          </Text>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'transparent', // Make background transparent for the title input
  },
  scrollContent: {
    padding: 15,
  },
  foodItem: {
    width: '45%', // Reduced by 30% for food items
    height: 84, // Reduced by 30% for food items
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 15,
    padding: 20,
    position: 'relative',
  },
  selectedFood: {
    borderColor: 'blue',
    borderWidth: 3,
  },
  removeMode: {
    opacity: 0.5,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  foodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  quantityCircle: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailView: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  detailText: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    width: '48%', // Adjusted to fit buttons
    height: 40, // Adjusted height
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  removeConfirmation: {
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmationText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeInstructions: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
});

export default FoodShelfLifeTracker;
