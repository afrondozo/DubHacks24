import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated } from 'react-native';

const FoodShelfLifeTracker = ({ navigation }) => {
  const [foods, setFoods] = useState([
    { id: 1, name: 'A5 Wagyu', quantity: 2, expiresIn: 5, expirationDate: '2023-10-18' },
    { id: 2, name: 'Yogurt', quantity: 3, expiresIn: 2, expirationDate: '2023-10-15' },
    { id: 3, name: 'Milk', quantity: 1, expiresIn: 7, expirationDate: '2023-10-20' },
    { id: 4, name: 'Bananas', quantity: 1, expiresIn: 1, expirationDate: '2023-10-14' },
    { id: 5, name: 'Ice Cream', quantity: 1, expiresIn: 30, expirationDate: '2023-11-12' },
    { id: 6, name: 'Rice', quantity: 1, expiresIn: 0, expirationDate: '2023-10-13' },  
  ]);

  const [selectedFood, setSelectedFood] = useState(null);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [title, setTitle] = useState("Food Shelf Life Tracker");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const detailPanelHeight = useRef(new Animated.Value(0)).current;

  const handleAddFood = (newFood) => {
    setFoods((prevFoods) => [...prevFoods, newFood]);
  };

  const toggleRemoveMode = () => {
    setIsRemoveMode(!isRemoveMode);
    setSelectedFood(null);
    hideDetailPanel();
  };

  const handleFoodPress = (food) => {
    if (isRemoveMode) {
      setSelectedFood(food);
    } else {
      if (selectedFood && selectedFood.id === food.id) {
        flipCard();
      } else {
        setSelectedFood(food);
        showDetailPanel();
      }
    }
  };

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: flipAnimation._value === 0 ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const showDetailPanel = () => {
    Animated.spring(detailPanelHeight, {
      toValue: 100,
      friction: 8,
      tension: 20,
      useNativeDriver: false,
    }).start();
  };

  const hideDetailPanel = () => {
    Animated.spring(detailPanelHeight, {
      toValue: 0,
      friction: 8,
      tension: 20,
      useNativeDriver: false,
    }).start();
  };

  const handleConfirmRemove = () => {
    if (selectedFood) {
      setFoods((prevFoods) => prevFoods.filter(item => item.id !== selectedFood.id));
      setSelectedFood(null);
      if (foods.length === 1) {
        setIsRemoveMode(false);
      }
    }
  };

  const handleBackgroundPress = () => {
    if (!isRemoveMode) {
      setSelectedFood(null);
      flipAnimation.setValue(0);
      hideDetailPanel();
    }
    setIsEditingTitle(false);
  };

  const getStatusColor = (expiresIn) => {
    if (expiresIn <= 1) return '#ff4444'; // Red
    if (expiresIn <= 3) return '#ffbb33'; // Yellow
    return '#00C851'; // Green
  };

  const getSuggestion = (expiresIn) => {
    if (expiresIn === 0) return 'Throw away immediately!';
    if (expiresIn === 1) return 'Use today or freeze!';
    if (expiresIn <= 3) return 'Use soon or consider freezing';
    return 'Still fresh, enjoy!';
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleTitlePress = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.content}>
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
                  selectedFood && selectedFood.id === food.id ? styles.selectedFood : null,
                  isRemoveMode && styles.removeMode
                ]}
                onPress={() => handleFoodPress(food)}
              >
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                  <View style={styles.foodContent}>
                    <View style={[styles.statusCircle, { backgroundColor: getStatusColor(food.expiresIn) }]} />
                    <Text style={styles.foodName}>{food.name}</Text>
                    {food.quantity > 1 && (
                      <View style={styles.quantityCircle}>
                        <Text style={styles.quantityText}>{food.quantity}x</Text>
                      </View>
                    )}
                  </View>
                </Animated.View>
                <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}>
                  <Text style={styles.suggestionText}>{getSuggestion(food.expiresIn)}</Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      
      <View style={styles.bottomContainer}>
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
        {isRemoveMode && (
          <Text style={styles.removeInstructions}>
            {selectedFood ? 'Tap Confirm Remove to delete the selected item' : 'Tap on a food item to select for removal'}
          </Text>
        )}
        <Animated.View style={[styles.detailPanel, { height: detailPanelHeight }]}>
          {selectedFood && (
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{selectedFood.name}</Text>
              <Text style={styles.detailText}>Expires on: {selectedFood.expirationDate}</Text>
              <Text style={styles.detailText}>
                {selectedFood.expiresIn === 0
                  ? "Expired"
                  : selectedFood.expiresIn === 1
                  ? "Expires today"
                  : `${selectedFood.expiresIn} days until expiration`}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 120, // Add extra padding at the bottom to ensure all items are visible
  },
  foodItem: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  selectedFood: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  removeMode: {
    opacity: 0.7,
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
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  quantityCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: 'green',
  },
  confirmButton: {
    backgroundColor: 'orange',
  },
  removeButton: {
    backgroundColor: 'red',
  },
  activeRemoveButton: {
    backgroundColor: 'gray',
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
    backgroundColor: 'white',
    paddingVertical: 5,
  },
  flipCard: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
  },
  detailPanel: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailContent: {
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FoodShelfLifeTracker;