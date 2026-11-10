#!/usr/bin/env bash
set -e

# MilkyPy Android Release Keystore Generator
# Generates a standard RSA 2048-bit keystore for signing Android APKs.

KEYSTORE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../android/app" && pwd)"
KEYSTORE_FILE="${KEYSTORE_DIR}/release.keystore"
PROPERTIES_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../android" && pwd)/key.properties"

echo "=========================================================="
echo "  MilkyPy Android Release Keystore Generator"
echo "=========================================================="

if [ -f "$KEYSTORE_FILE" ]; then
  echo "Keystore already exists at: ${KEYSTORE_FILE}"
  exit 0
fi

read -sp "Enter Keystore & Key Password (minimum 6 characters): " PASSWORD
echo ""

if [ ${#PASSWORD} -lt 6 ]; then
  echo "Error: Password must be at least 6 characters long."
  exit 1
fi

ALIAS="milkypy_release_key"

echo "Generating release keystore at ${KEYSTORE_FILE}..."

keytool -genkeypair -v \
  -keystore "$KEYSTORE_FILE" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$PASSWORD" \
  -keypass "$PASSWORD" \
  -dname "CN=MilkyPy Developer, OU=Mobile, O=MilkyPy, L=San Francisco, ST=California, C=US"

cat << EOF > "$PROPERTIES_FILE"
# Generated Android Release Keystore Configuration
storeFile=release.keystore
storePassword=${PASSWORD}
keyAlias=${ALIAS}
keyPassword=${PASSWORD}
EOF

echo "Keystore created successfully!"
echo "Created: ${KEYSTORE_FILE}"
echo "Created: ${PROPERTIES_FILE}"
echo ""
echo "You can now build a signed release APK with:"
echo "  cd android && ./gradlew assembleRelease"
