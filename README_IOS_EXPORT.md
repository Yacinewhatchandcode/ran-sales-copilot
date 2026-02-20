# RAN Sales Co-Pilot - iOS Export & Signing

To install this app on your actual iPhone device under European law via sideloading (AltStore / Sideloadly) or official Apple Developer provisioning, follow these exact steps.

### Step 1: Open in Xcode
1. Run `npx cap open ios` inside the `ran-sales-copilot` folder to open the project in Xcode.
(If Xcode is not installed, install it from the Mac App Store).

### Step 2: Configure Signing & Capabilities
1. In Xcode, click on the **App** project in the left navigation panel.
2. Select the **App** target and go to the **Signing & Capabilities** tab.
3. Check the box **"Automatically manage signing"**.
4. In the **Team** dropdown, select your Apple ID (you may need to add it via Xcode Preferences > Accounts).
5. Ensure the Bundle Identifier is `com.ran.copilot`.

### Step 3: Build & Export an .IPA File
1. Connect your iPhone to your Mac via USB.
2. At the top of Xcode, change the destination device from "Any iOS Simulator Device" to your actual connected iPhone.
3. Go to the top menu: **Product > Build** (Cmd + B) to ensure it compiles.
4. To generate the `.ipa` (the installable file):
   - Go to **Product > Archive**.
   - Once archived, the Organizer window will open. Click **Distribute App**.
   - Select **Development** or **Ad Hoc** (depending on if you have a paid Apple Developer account).
   - Click Next until it exports the `.ipa` file to a folder.

### Step 4: Sideloading onto your iPhone
If you do not have a paid Apple Developer Account but want it on your phone for 7 days (renewable):
1. Download [Sideloadly](https://sideloadly.io/) or [AltStore](https://altstore.io/).
2. Drag and drop the exported `App.ipa` file into Sideloadly.
3. Enter your Apple ID and click Start.
4. Once installed, go to your iPhone **Settings > General > VPN & Device Management**, tap your Apple ID, and **Trust** the developer.

If you are using the new EU Alternative App Stores (like AltStore PAL):
You can host the generated `.ipa` and distribute it directly if your developer account is registered and approved under the EU DMA terms.
