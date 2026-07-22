<template>
  <div class="app-container">
    <!-- Technical backgrounds -->
    <div class="bg-blueprint"></div>
    <div class="bg-noise"></div>
    <div class="ambient-glow"></div>

    <!-- Top Navbar -->
    <Navbar />

    <!-- Main content routing -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Bottom Telemetry Bar -->
    <TelemetryBar />
  </div>
</template>

<style lang="scss">
// Global styling overrides
</style>
