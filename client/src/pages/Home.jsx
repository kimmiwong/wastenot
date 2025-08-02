import { useState } from "react";
import { Link } from "react-router-dom";
import ShowItems from "../components/ShowItems";
import AddItem from "../components/AddItem";
import CreateHousehold from "../components/CreateHousehold";
import { useIngredients } from "../context/RecipesContext";
import { useUser } from "../context/UserProvider";
import InviteHouseholdMember from "../components/InviteHouseholdMember";
import JoinHousehold from "../components/JoinHousehold";

export default function Home() {
  const { setSelectedIngredient } = useIngredients();
  // useUser provides the current user and a refresh function from context.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, refreshUser } = useUser();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const hasHousehold = user?.household || user?.household_id;
  console.log("User object:", user);

  return (
    <div className="page-content">
      <div>
        <AddItem onItemAdded={triggerRefresh} />

        <div className="household-wrapper">
          {!hasHousehold && (
            <button
              className="household-button"
              onClick={() => setIsModalOpen(true)}
            >
              Create Household
            </button>
          )}
        </div>

        <ShowItems refreshTrigger={refreshTrigger} />
      </div>

      <div className="recipe-button-wrapper">
        <Link to="/recipe" className="recipe-button">
          Generate Recipe
        </Link>
        <button
          type="button"
          onClick={() => setSelectedIngredient([])}
          className="clear-button"
        >
          Clear Selection
        </button>
      </div>
      <CreateHousehold
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async () => {
          await refreshUser();
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }}
      />
      <InviteHouseholdMember />
      <JoinHousehold />
    </div>
  );
}
