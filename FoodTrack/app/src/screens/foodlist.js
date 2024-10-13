import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const FoodShelfLifeTracker = ({ navigation }) => {
  const [foods, setFoods] = useState([
    { id: 1, name: 'A5 Wagyu', quantity: 2, expiresIn: 5 },
    { id: 2, name: 'Yogurt', quantity: 3, expiresIn: 2 },
    { id: 3, name: 'Fish', quantity: 1, expiresIn: 3 },
    { id: 4, name: 'Milk', quantity: 1, expiresIn: 7 },
    { id: 5, name: 'Bananas', quantity: 1, expiresIn: 1 },
    { id: 6, name: 'Ice Cream', quantity: 1, expiresIn: 30 },
    { id: 7, name: 'Rice', quantity: 1, expiresIn: 0 },
    { id: 8, name: 'Broccoli', quantity: 1, expiresIn: 3 },
    { id: 9, name: 'Tomato', quantity: 1, expiresIn: 5 },
    { id: 10, name: 'Cheese', quantity: 1, expiresIn: 2 },
    { id: 11, name: 'Apples', quantity: 1, expiresIn: 10 },
    { id: 12, name: 'Carrots', quantity: 1, expiresIn: 6 },
  ]);

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [trackerTitle, setTrackerTitle] = useState("Food Tracker");
  const [selectedFoodDetails, setSelectedFoodDetails] = useState(null); // New state for selected food details

  const sortedFoods = useMemo(() => {
    return [...foods].sort((a, b) => a.expiresIn - b.expiresIn);
  }, [foods]);

  const handleAddFood = (newFood) => {
    setFoods((prevFoods) => [...prevFoods, newFood]);
  };

  const toggleRemoveMode = () => {
    setIsRemoveMode(!isRemoveMode);
    setSelectedFoods([]); // Reset selected foods when toggling mode
  };

  const handleFoodPress = (food) => {
    if (isRemoveMode) {
      if (selectedFoods.includes(food)) {
        setSelectedFoods(selectedFoods.filter(item => item !== food));
      } else {
        setSelectedFoods([...selectedFoods, food]);
      }
    } else {
      // Show details including expiration countdown when not in remove mode
      setSelectedFoodDetails(food);
    }
  };

  const handleConfirmRemove = () => {
    if (selectedFoods.length > 0) {
      setFoods((prevFoods) => prevFoods.filter(item => !selectedFoods.includes(item)));
      setSelectedFoods([]); // Clear selected foods after removal
      setIsRemoveMode(false); // Exit remove mode after deletion
    }
  };

  const getBackgroundColor = (food) => {
    const addFoodButtonColor = '#4CAF50'; // Green color for add button
    if (food.expiresIn <= 1) return '#ff6666'; // Red
    if (food.expiresIn <= 3) return '#ffcc99'; // Pastel Yellow
    if (food.expiresIn <= 7) return '#ffff99'; // Light Pastel Yellow
    return addFoodButtonColor; // Use same green color for normal food items
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <TextInput 
          style={styles.titleInput} 
          value={trackerTitle} 
          onChangeText={setTrackerTitle} 
          editable={!isRemoveMode} // Prevent editing when in remove mode
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedFoods.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={[
              styles.foodItem,
              { backgroundColor: getBackgroundColor(food) },
              selectedFoods.includes(food) ? styles.selectedFood : null,
              isRemoveMode && styles.removeMode
            ]}
            onPress={() => handleFoodPress(food)}
          >
            {food.quantity > 1 && (
              <View style={styles.quantityCircle}>
                <Text style={styles.quantityText}>{food.quantity}x</Text>
              </View>
            )}
            <View style={styles.textContainer}>
              <Text style={styles.foodName}>{food.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Show expiration countdown at the bottom */}
      {selectedFoodDetails && !isRemoveMode && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            Expires in: {selectedFoodDetails.expiresIn} day{selectedFoodDetails.expiresIn > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {isRemoveMode && (
        <View style={styles.removeConfirmation}>
          <Text style={styles.confirmationText}>
            {selectedFoods.length === 0 
              ? 'No items selected' 
              : `Are you sure you want to remove ${selectedFoods.length} item(s)?`}
          </Text>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleConfirmRemove}
            disabled={selectedFoods.length === 0}
          >
            <Text style={styles.buttonText}>Confirm Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, isRemoveMode ? styles.removeButton : styles.addButton]} 
          onPress={isRemoveMode ? handleConfirmRemove : () => navigation.navigate('AddFood', { onAddFood: handleAddFood })}
        >
          <Text style={styles.buttonText}>{isRemoveMode ? 'Confirm Remove' : 'Add Food'}</Text>
        </TouchableOpacity>
        {!isRemoveMode && (
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={toggleRemoveMode}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  titleContainer: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  foodItem: {
    width: '45%', // Reduced by 30% for food items
    height: 84, // Reduced by 30% for food items
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 15,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#000', // Black outline
  },
  selectedFood: {
    borderColor: 'purple',
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
  foodName: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'black', // Set the text shadow color to black for outline effect
    textShadowOffset: { width: -1, height: -1 }, // Negative offset for left-top outline
    textShadowRadius: 1, // Radius of the shadow
  },
  alertContainer: {
    backgroundColor: '#444', // Dark gray background for alert
    padding: 10,
    borderRadius: 5,
    margin: 15,
  },
  alertText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  quantityCircle: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: 'black',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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
});

export default FoodShelfLifeTracker;
