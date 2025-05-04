import UserDevice from '../models/UserDevice.js';
import Alert from '../models/Alert.js';

async function notifyUsersOnRiskChange(deviceId, oldRisk, newRisk) {
  const riskLevels = ['low', 'moderate', 'high'];
  const oldIndex = riskLevels.indexOf(oldRisk);
  const newIndex = riskLevels.indexOf(newRisk);

  if (newIndex <= oldIndex) return; // Only notify if risk increased

  try {
    const followers = await UserDevice.find({ deviceId });

    const alerts = followers.map(user =>
      Alert.create({
        userId: user.userId,
        deviceId,
        message: `⚠️ Risk for ${deviceId} increased from ${oldRisk} → ${newRisk}`,
        alertType: 'risk-update'
      })
    );

    await Promise.all(alerts);
    console.log(`✅ ${followers.length} alerts sent for ${deviceId}`);
  } catch (err) {
    console.error('❌ Failed to notify users:', err.message);
  }
}

export default notifyUsersOnRiskChange;

