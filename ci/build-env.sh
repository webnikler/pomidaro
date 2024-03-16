#!/bin/sh

[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

cd src
mkdir -p environments
cd environments

echo "export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '"$POMIDARO_FIREBASE_API_KEY"',
    authDomain: '"$POMIDARO_FIREBASE_AUTH_DOMAIN"',
    projectId: '"$POMIDARO_FIREBASE_PROJECT_ID"',
    storageBucket: '"$POMIDARO_FIREBASE_STORAGE_BUCKET"',
    messagingSenderId: '"$POMIDARO_FIREBASE_MESSAGING_SENDER_ID"',
    appId: '"$POMIDARO_FIREBASE_APP_ID"',
  }
};" > environment.ts

echo 'Finished setting up environment'

exit 0
