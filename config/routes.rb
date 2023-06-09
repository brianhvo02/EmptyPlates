Rails.application.routes.draw do
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

    # Defines the root path route ("/")
    # root "articles#index"

    namespace :api, defaults: { format: :json } do
        resources :users, only: [:create, :show] do
            resources :reservations, only: [:create, :update]
        end
        
        resources :reservations, only: [:destroy] do
            resources :reviews, only: [:create, :update, :destroy]
        end

        resource :session, only: [:create, :show, :destroy]

        resources :neighborhoods, only: [:index, :show]
        resources :cuisines, only: [:index, :show]

        resources :restaurants, only: [:index, :create, :show, :update, :destroy] do
            resources :available_tables, only: [:create]
        end

        get '/search', to: 'restaurants#search'
    end

    get '*path', to: 'static_pages#frontend_index', constraints: lambda { |req| req.path.exclude? 'rails' }
  
end
