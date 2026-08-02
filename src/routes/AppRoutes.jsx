import ProtectedRoute from "./ProtectedRoute";

<Route
  path="/game"
  element={
    <ProtectedRoute>
      <Game />
    </ProtectedRoute>
  }
/>