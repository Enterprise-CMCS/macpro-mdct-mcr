LD_LOG_FILE=launchdarkly-flags.log
echo "# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n" > $LD_LOG_FILE
echo "# LaunchDarkly flags in components" >> $LD_LOG_FILE
grep -r -n -o -w  "useFlags().*" ./services --include=*.tsx --exclude=*.test.tsx --exclude-dir=coverage >> $LD_LOG_FILE
echo "" >> $LD_LOG_FILE
echo "# LaunchDarkly flags in tests" >> $LD_LOG_FILE
grep -r -n -o -w "mockLDFlags.set.*" ./services --include=*.test.tsx --exclude-dir=coverage >> $LD_LOG_FILE
