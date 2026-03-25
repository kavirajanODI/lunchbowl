@echo off
echo Starting Android project...


:: Start the React Native server
start cmd /k "npx react-native start"

:: Run the Android project
npx react-native run-android

echo Android project started.
pause