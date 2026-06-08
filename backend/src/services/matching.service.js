// ============================================================
// src/services/matching.service.js
// Core Matching Algorithm
// This is the brain of the application. It scores profiles
// based on compatibility using gender-specific rules.
//
// For MALE customers: Match with younger, shorter, lower-income
//                     women with matching views on children.
// For FEMALE customers: Match based on profession, education,
//                       values, relocation, lifestyle fit.
// ============================================================

// ─── SCORING HELPERS ─────────────────────────────────────────

// Returns a score 0-20 based on age difference (for male customer matching)
const scoreAge = (customerAge, profileAge) => {
  const ageDiff = customerAge - profileAge;
  // Best match: female is 2-5 years younger
  if (ageDiff >= 2 && ageDiff <= 5) return 20;
  if (ageDiff >= 0 && ageDiff < 2) return 14; // slightly younger is OK
  if (ageDiff > 5 && ageDiff <= 10) return 8; // much younger is less ideal
  return 0; // female older than male = no score
};

// Returns 0-15 based on height difference (for male customer matching)
const scoreHeight = (customerHeight, profileHeight) => {
  // Male should be taller than female
  const heightDiff = customerHeight - profileHeight;
  if (heightDiff >= 10 && heightDiff <= 25) return 15; // ideal height diff
  if (heightDiff >= 5 && heightDiff < 10) return 10;
  if (heightDiff > 0 && heightDiff < 5) return 5;
  return 0; // if female is taller, no score
};

// Returns 0-15 based on income (for male customer matching)
const scoreIncome = (customerIncome, profileIncome) => {
  // For male clients: female should earn same or less
  if (profileIncome <= customerIncome) return 15;
  // Slightly over is acceptable
  if (profileIncome <= customerIncome * 1.2) return 10;
  return 0;
};

// Returns 0-20 based on kids preference match
const scoreKids = (customerKids, profileKids) => {
  if (customerKids === profileKids) return 20; // Exact match
  if (customerKids === "Maybe" || profileKids === "Maybe") return 12; // Flexible
  return 0; // Strict mismatch
};

// Returns 0-10 based on religion match
const scoreReligion = (customerReligion, profileReligion) => {
  return customerReligion === profileReligion ? 10 : 0;
};

// Returns 0-10 based on diet compatibility
const scoreDiet = (customerDiet, profileDiet) => {
  if (customerDiet === profileDiet) return 10;
  // Vegetarian/Jain are strict diets — mismatch = 0
  if (customerDiet === "Jain" || profileDiet === "Jain") return 0;
  if (customerDiet === "Vegetarian" && profileDiet !== "Vegetarian") return 2;
  return 6; // Non-veg vs Non-veg with different sub-types
};

// Returns 0-10 based on relocation preference match
const scoreRelocation = (customerReloc, profileReloc) => {
  if (customerReloc === profileReloc) return 10;
  if (customerReloc === "Maybe" || profileReloc === "Maybe") return 7;
  return 0;
};

// Returns 0-10 based on language overlap
const scoreLanguages = (customerLangs, profileLangs) => {
  const overlap = customerLangs.filter((lang) => profileLangs.includes(lang));
  if (overlap.length >= 2) return 10;
  if (overlap.length === 1) return 5;
  return 0;
};

// For female customers: score based on profession/education tier
// Higher education = better match score
const scoreEducation = (profileDegree) => {
  const tier1 = ["IIT", "IIM", "AIIMS", "PhD", "MBBS MD", "LLM"];
  const tier2 = ["M.Tech", "MBA", "CA", "MBBS", "LLB", "M.Sc"];

  for (const keyword of tier1) {
    if (profileDegree.includes(keyword)) return 15;
  }
  for (const keyword of tier2) {
    if (profileDegree.includes(keyword)) return 10;
  }
  return 5; // Bachelor level
};

// Converts a raw score to a label
const getMatchLabel = (score) => {
  if (score >= 80) return { label: "High Potential", color: "green" };
  if (score >= 60) return { label: "Good Match", color: "blue" };
  if (score >= 40) return { label: "Possible Match", color: "yellow" };
  return { label: "Low Compatibility", color: "red" };
};

// Generates a human-readable reason for the match score
const getMatchReason = (score, profile, customer) => {
  const reasons = [];

  if (customer.gender === "Male") {
    if (profile.age < customer.age) reasons.push(`${profile.firstName} is younger`);
    if (profile.height < customer.height) reasons.push("height compatibility");
    if (profile.income <= customer.income) reasons.push("income compatibility");
    if (profile.wantKids === customer.wantKids) reasons.push("aligned on kids");
    if (profile.religion === customer.religion) reasons.push("same religion");
    if (profile.diet === customer.diet) reasons.push("same diet preference");
  } else {
    const sharedLangs = customer.languagesKnown.filter((l) =>
      profile.languagesKnown.includes(l)
    );
    if (sharedLangs.length > 0) reasons.push(`speaks ${sharedLangs[0]}`);
    if (profile.openToRelocate === customer.openToRelocate) reasons.push("relocation aligned");
    if (profile.wantKids === customer.wantKids) reasons.push("aligned on family plans");
    if (profile.religion === customer.religion) reasons.push("same religion");
  }

  if (reasons.length === 0) return "Some compatibility detected";
  return reasons.slice(0, 3).join(", ");
};

// ─── MAIN MATCHING FUNCTION ───────────────────────────────────
// customer: the TDC client we're finding matches for
// pool: the array of opposite-gender profiles to score
export const scoreMatches = (customer, pool) => {
  const scoredMatches = pool.map((profile) => {
    let totalScore = 0;

    if (customer.gender === "Male") {
      // ── Male customer matching logic ──
      // Based on: younger, shorter, lower income female + matching kids view
      totalScore += scoreAge(customer.age, profile.age);
      totalScore += scoreHeight(customer.height, profile.height);
      totalScore += scoreIncome(customer.income, profile.income);
      totalScore += scoreKids(customer.wantKids, profile.wantKids);
      totalScore += scoreReligion(customer.religion, profile.religion);
      totalScore += scoreDiet(customer.diet, profile.diet);
      totalScore += scoreLanguages(customer.languagesKnown, profile.languagesKnown);
      totalScore += scoreRelocation(customer.openToRelocate, profile.openToRelocate);
    } else {
      // ── Female customer matching logic ──
      // Based on: profession compatibility, values, relocation, education
      totalScore += scoreEducation(profile.degree);
      totalScore += scoreKids(customer.wantKids, profile.wantKids);
      totalScore += scoreReligion(customer.religion, profile.religion);
      totalScore += scoreDiet(customer.diet, profile.diet);
      totalScore += scoreRelocation(customer.openToRelocate, profile.openToRelocate);
      totalScore += scoreLanguages(customer.languagesKnown, profile.languagesKnown);
      totalScore += scoreIncome(profile.income, customer.income); // Male should earn same or more

      // Bonus: pets preference match
      if (customer.openToPets === profile.openToPets) totalScore += 5;
      // Bonus: family type match
      if (customer.familyType === profile.familyType) totalScore += 5;
    }

    // Normalize score to a 0-100 range
    const maxScore = customer.gender === "Male" ? 105 : 100;
    const normalizedScore = Math.min(Math.round((totalScore / maxScore) * 100), 100);

    const { label, color } = getMatchLabel(normalizedScore);
    const reason = getMatchReason(normalizedScore, profile, customer);

    return {
      ...profile,
      matchScore: normalizedScore,
      matchLabel: label,
      matchColor: color,
      matchReason: reason,
    };
  });

  // Sort by highest score first, return top 15
  return scoredMatches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 15);
};
