run_deploy:
	git add -A
	git commit -m "done"
	yarn build
	netlify deploy --prod