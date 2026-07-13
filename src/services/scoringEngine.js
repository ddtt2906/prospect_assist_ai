export function calculateIntentScore(events) {
  let score = 0;
  const components = [];
  
  const productVisits = events.filter(e => e.eventType === 'loan_product_viewed').length;
  if (productVisits > 2) {
    score += 15;
    components.push({ label: "Repeated product visits", points: 15 });
  }

  const calcUses = events.filter(e => e.eventType.includes('calculator')).length;
  if (calcUses > 2) {
    score += 15;
    components.push({ label: "Repeated calculator usage", points: 15 });
  }

  const appStarted = events.some(e => e.eventType === 'application_started');
  if (appStarted) {
    score += 15;
    components.push({ label: "Application started", points: 15 });
  }

  const maxProgress = Math.max(...events.map(e => e.properties?.completionPct || 0), 0);
  if (maxProgress > 50) {
    score += 8;
    components.push({ label: "Application progress", points: 8 });
  }

  const abandonedAndResumed = events.some(e => e.eventType === 'application_abandoned') && 
                              events.some(e => e.eventType === 'application_resumed');
  if (abandonedAndResumed) {
    score += 15;
    components.push({ label: "Returned after abandonment", points: 15 });
  }

  const docsViewed = events.some(e => e.eventType === 'document_list_viewed');
  if (docsViewed) {
    score += 10;
    components.push({ label: "Document research", points: 10 });
  }

  const timelineConfirmed = events.some(e => e.properties?.purchaseTimelineDays <= 30);
  if (timelineConfirmed) {
    score += 10;
    components.push({ label: "Near-term purchase", points: 10 });
  }

  const chatStarted = events.some(e => e.eventType === 'chat_started');
  if (chatStarted) {
    score += 4;
    components.push({ label: "Chat confirmation", points: 4 });
  }

  let band = "LOW";
  if (score >= 90) band = "VERY_HIGH";
  else if (score >= 75) band = "HIGH";
  else if (score >= 50) band = "MEDIUM";

  return { score: Math.min(score, 100), band, components };
}

export function determineNextBestAction(intentScore, affordabilityFit, incrementalUplift, capacityConfidence, trustConfidence) {
  if (trustConfidence < 60) {
    return "ENHANCED_VERIFICATION";
  } else if (intentScore >= 75 && affordabilityFit >= 70 && incrementalUplift >= 10) {
    return "RM_ASSISTED_REVISED_OFFER";
  } else if (intentScore >= 75 && affordabilityFit >= 80 && incrementalUplift < 5) {
    return "DIGITAL_SELF_SERVICE";
  } else if (intentScore >= 75 && affordabilityFit < 40) {
    return "RESPONSIBLE_SMALLER_OFFER";
  } else if (intentScore < 50 && capacityConfidence >= 70) {
    return "DIGITAL_NURTURE";
  } else {
    return "REQUEST_ADDITIONAL_DATA";
  }
}
