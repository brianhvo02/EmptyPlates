Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show]
    resource :session, only: [:create, :show, :destroy]

    resources :neighborhoods, only: [:index]
    resources :cuisines, only: [:index]

    resources :restaurants, only: [:index, :create, :show, :update, :destroy]
  end

  root to: "static_pages#frontend_index"
  match '/restaurants', to: "static_pages#frontend_index", via: [:get]
  
end
